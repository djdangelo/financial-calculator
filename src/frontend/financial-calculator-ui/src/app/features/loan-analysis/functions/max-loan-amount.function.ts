import { monthlyRateFromAnnualPercent, percentToRatio, roundMoney } from '@core/functions/finance.function';
import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { LoanAnalysisInput } from '../interfaces/loan-analysis-input.interface';
import { MaxLoanAmount } from '../interfaces/max-loan-amount.interface';
import { MonthlyBudget } from '../interfaces/monthly-budget.interface';

export function calculateMaxMonthlyPayment(
  budget: Omit<MonthlyBudget, 'newLoanPayment'>,
  limits: BurdenLimits
): number {
  const totalRoom = budget.netIncome * percentToRatio(limits.totalBurdenPercent) - budget.expenses - budget.currentDebtPayments;
  const debtRoom = budget.netIncome * percentToRatio(limits.debtBurdenPercent) - budget.currentDebtPayments;
  return roundMoney(Math.max(0, Math.min(totalRoom, debtRoom)));
}

export function calculatePrincipalForPayment(levelPayment: number, terms: Omit<LoanTerms, 'principal'>): number {
  if (levelPayment <= 0 || terms.termMonths <= 0) {
    return 0;
  }

  const monthlyRate = monthlyRateFromAnnualPercent(terms.annualRatePercent);
  if (monthlyRate === 0) {
    return roundMoney(levelPayment * terms.termMonths);
  }
  return roundMoney(levelPayment * (1 - (1 + monthlyRate) ** -terms.termMonths) / monthlyRate);
}

export function calculateMaxLoanAmount({
  offer,
  netIncome,
  expenses,
  currentDebtPayments,
  limits
}: LoanAnalysisInput): MaxLoanAmount {
  const maxPayment = calculateMaxMonthlyPayment({ netIncome, expenses, currentDebtPayments }, limits);
  const principal = calculatePrincipalForPayment(maxPayment - offer.monthlyInsurance, offer);
  const financedFeeFactor = offer.feeMode === 'financed' ? 1 + percentToRatio(offer.disbursementFeePercent) : 1;
  const maxAmount = roundMoney(principal / financedFeeFactor);

  return { maxPayment, maxAmount, exceedsMax: offer.amount > maxAmount };
}
