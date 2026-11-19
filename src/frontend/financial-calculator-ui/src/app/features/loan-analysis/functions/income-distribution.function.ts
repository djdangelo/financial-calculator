import { ratioToPercent, roundMoney } from '@core/functions/finance.function';
import { IncomeSliceKey } from '../@types/income-slice-key.type';
import { IncomeSlice } from '../interfaces/income-slice.interface';
import { MonthlyBudget } from '../interfaces/monthly-budget.interface';

export function buildIncomeDistribution(budget: MonthlyBudget): IncomeSlice[] {
  const commitments = budget.expenses + budget.currentDebtPayments + budget.newLoanPayment;
  const available = Math.max(budget.netIncome - commitments, 0);
  const whole = Math.max(budget.netIncome, commitments);
  const amounts: Record<IncomeSliceKey, number> = {
    expenses: budget.expenses,
    'current-debts': budget.currentDebtPayments,
    'new-payment': budget.newLoanPayment,
    available
  };

  return (Object.keys(amounts) as IncomeSliceKey[])
    .filter(key => amounts[key] > 0)
    .map(key => ({
      key,
      amount: roundMoney(amounts[key]),
      sharePercent: whole > 0 ? ratioToPercent(amounts[key] / whole) : 0
    }));
}
