import { ratioToPercent } from '@core/functions/finance.function';
import { DebtIndicators } from '../interfaces/debt-indicators.interface';
import { MonthlyBudget } from '../interfaces/monthly-budget.interface';

export function calculateBurdenPercent(commitments: number, netIncome: number): number {
  if (netIncome <= 0) {
    return commitments > 0 ? Number.POSITIVE_INFINITY : 0;
  }
  return ratioToPercent(commitments / netIncome);
}

export function calculateDebtIndicators(budget: MonthlyBudget): DebtIndicators {
  const debtPayments = budget.currentDebtPayments + budget.newLoanPayment;
  return {
    totalBurdenPercent: calculateBurdenPercent(budget.expenses + debtPayments, budget.netIncome),
    debtBurdenPercent: calculateBurdenPercent(debtPayments, budget.netIncome)
  };
}
