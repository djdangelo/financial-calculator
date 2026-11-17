import { MIN_MONEY_AMOUNT } from '@core/constants/finance.constant';
import { ProfileStepKey } from '../@types/profile-step-key.type';
import { MIN_REMAINING_MONTHS, PROFILE_STEP_KEYS } from '../constants/financial-profile.constant';
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
    || (Number.isInteger(debt.remainingMonths) && debt.remainingMonths >= MIN_REMAINING_MONTHS);
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

export function findPendingStepBefore(
  target: ProfileStepKey,
  completed: readonly ProfileStepKey[]
): ProfileStepKey | null {
  const previousSteps = PROFILE_STEP_KEYS.slice(0, PROFILE_STEP_KEYS.indexOf(target));
  return previousSteps.find(step => !completed.includes(step)) ?? null;
}
