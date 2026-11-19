import { CurrencyCode } from '@core/@types/currency-code.type';
import { sumInCurrency } from '@core/functions/currency.function';
import { monthlyRateFromAnnualPercent, roundMoney } from '@core/functions/finance.function';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import {
  calculateDebtBalance,
  calculateMonthlyDebtPayments
} from '@features/financial-profile/functions/profile-totals.function';
import { Debt } from '@features/financial-profile/models';
import { ConsolidationIssue } from '../@types/consolidation-issue.type';
import { Verdict } from '../@types/verdict.type';
import { CONSOLIDATION_REQUIRED_VERDICT } from '../constants/loan-analysis.constant';
import { DebtConsolidation } from '../interfaces/debt-consolidation.interface';
import { DebtConsolidationInput } from '../interfaces/debt-consolidation-input.interface';

export function estimateRemainingMonths(debt: Debt): number | null {
  if (debt.remainingMonths !== null) {
    return debt.remainingMonths;
  }
  if (debt.annualRatePercent === null || debt.monthlyPayment <= 0) {
    return null;
  }

  const monthlyRate = monthlyRateFromAnnualPercent(debt.annualRatePercent);
  if (monthlyRate === 0) {
    return debt.balance / debt.monthlyPayment;
  }

  const monthlyInterest = debt.balance * monthlyRate;
  if (debt.monthlyPayment <= monthlyInterest) {
    return null;
  }
  return -Math.log(1 - monthlyInterest / debt.monthlyPayment) / Math.log(1 + monthlyRate);
}

export function estimateRemainingDebtCost(debt: Debt): number | null {
  const months = estimateRemainingMonths(debt);
  return months === null ? null : roundMoney(debt.monthlyPayment * months);
}

export function estimateRemainingDebtsCost(
  debts: readonly Debt[],
  currency: CurrencyCode,
  rates: ExchangeRates
): number | null {
  const costs = debts.flatMap(debt => {
    const amount = estimateRemainingDebtCost(debt);
    return amount === null ? [] : [{ amount, currency: debt.currency }];
  });
  return costs.length === debts.length ? sumInCurrency(costs, currency, rates) : null;
}

export function resolveConsolidationIssues(cashLeft: number, monthlySavings: number, verdict: Verdict): ConsolidationIssue[] {
  const issues: ConsolidationIssue[] = [];
  if (cashLeft < 0) {
    issues.push('insufficient-amount');
  }
  if (monthlySavings <= 0) {
    issues.push('higher-payment');
  }
  if (verdict !== CONSOLIDATION_REQUIRED_VERDICT) {
    issues.push('over-limits');
  }
  return issues;
}

export function analyzeDebtConsolidation({ debts, currency, rates, cost, verdict }: DebtConsolidationInput): DebtConsolidation {
  const coveredBalance = calculateDebtBalance(debts, currency, rates);
  const replacedPayments = calculateMonthlyDebtPayments(debts, currency, rates);
  const currentRemainingCost = estimateRemainingDebtsCost(debts, currency, rates);
  const cashLeft = roundMoney(cost.netDisbursement - coveredBalance);
  const monthlySavings = roundMoney(replacedPayments - cost.monthlyPayment);
  const consolidatedTotalCost = roundMoney(cost.totalPaid - cashLeft);
  const issues = resolveConsolidationIssues(cashLeft, monthlySavings, verdict);

  return {
    debtCount: debts.length,
    coveredBalance,
    netDisbursement: cost.netDisbursement,
    cashLeft,
    replacedPayments,
    newPayment: cost.monthlyPayment,
    monthlySavings,
    currentRemainingCost,
    consolidatedTotalCost,
    extraTotalCost: currentRemainingCost === null ? null : roundMoney(consolidatedTotalCost - currentRemainingCost),
    issues,
    recommended: issues.length === 0
  };
}
