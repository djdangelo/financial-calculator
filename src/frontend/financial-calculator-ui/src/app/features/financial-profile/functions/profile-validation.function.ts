import { MIN_MONEY_AMOUNT, MIN_TERM_MONTHS } from '@core/constants/finance.constant';
import { Debt, Expense, Income } from '../models';

export function isIncomeValid(income: Income): boolean {
  return income.monthlyAmount >= MIN_MONEY_AMOUNT && income.monthlyCosts >= 0;
}

export function isExpenseValid(expense: Expense): boolean {
  return expense.monthlyAmount >= MIN_MONEY_AMOUNT;
}

export function isDebtValid(debt: Debt): boolean {
  const hasValidRate = debt.annualRatePercent === null || debt.annualRatePercent >= 0;
  const hasValidTerm = debt.remainingMonths === null
    || (Number.isInteger(debt.remainingMonths) && debt.remainingMonths >= MIN_TERM_MONTHS);
  return debt.monthlyPayment >= MIN_MONEY_AMOUNT && debt.balance >= MIN_MONEY_AMOUNT && hasValidRate && hasValidTerm;
}

export function isIncomeStepComplete(incomes: readonly Income[]): boolean {
  return incomes.length > 0 && incomes.every(isIncomeValid);
}

export function isExpensesStepComplete(expenses: readonly Expense[]): boolean {
  return expenses.length > 0 && expenses.every(isExpenseValid);
}

export function isDebtsStepComplete(debts: readonly Debt[]): boolean {
  return debts.every(isDebtValid);
}
