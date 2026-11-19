import { roundMoney } from '@core/functions/finance.function';
import { LoanAnalysis } from '../interfaces/loan-analysis.interface';
import { LoanAnalysisInput } from '../interfaces/loan-analysis-input.interface';
import { MonthlyBudget } from '../interfaces/monthly-budget.interface';
import { calculateDebtIndicators } from './debt-indicators.function';
import { summarizeLoanCost } from './loan-cost.function';
import { calculateMaxLoanAmount } from './max-loan-amount.function';
import { resolveVerdict } from './verdict.function';

export function calculateAvailableAfterLoan(budget: MonthlyBudget): number {
  return roundMoney(budget.netIncome - budget.expenses - budget.currentDebtPayments - budget.newLoanPayment);
}

export function analyzeLoan(input: LoanAnalysisInput): LoanAnalysis {
  const { offer, netIncome, expenses, currentDebtPayments, limits } = input;
  const cost = summarizeLoanCost(offer);
  const budget: MonthlyBudget = { netIncome, expenses, currentDebtPayments, newLoanPayment: cost.monthlyPayment };
  const indicators = calculateDebtIndicators(budget);

  return {
    currency: offer.currency,
    cost,
    budget,
    indicators,
    limits,
    verdict: resolveVerdict(indicators, limits),
    availableAfterLoan: calculateAvailableAfterLoan(budget),
    maxLoan: calculateMaxLoanAmount(input)
  };
}
