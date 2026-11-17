import { DebtType } from '../@types/debt-type.type';
import { ExpenseCategory } from '../@types/expense-category.type';
import { IncomeType } from '../@types/income-type.type';
import { EntryOption } from '../interfaces/entry-option.interface';

export const INCOME_ICON: Record<IncomeType, string> = {
  salary: 'pi pi-briefcase',
  business: 'pi pi-shop',
  other: 'pi pi-plus-circle'
};

export const EXPENSE_ICON: Record<ExpenseCategory, string> = {
  housing: 'pi pi-home',
  food: 'pi pi-shopping-cart',
  utilities: 'pi pi-bolt',
  transport: 'pi pi-car',
  education: 'pi pi-graduation-cap',
  health: 'pi pi-heart',
  other: 'pi pi-ellipsis-h'
};

export const DEBT_ICON: Record<DebtType, string> = {
  'credit-card': 'pi pi-credit-card',
  'personal-loan': 'pi pi-money-bill',
  vehicle: 'pi pi-car',
  mortgage: 'pi pi-home',
  'store-credit': 'pi pi-shopping-bag',
  other: 'pi pi-ellipsis-h'
};

export const INCOME_OPTIONS: readonly EntryOption<IncomeType>[] = [
  { value: 'salary', icon: INCOME_ICON.salary },
  { value: 'business', icon: INCOME_ICON.business },
  { value: 'other', icon: INCOME_ICON.other }
];

export const EXPENSE_OPTIONS: readonly EntryOption<ExpenseCategory>[] = [
  { value: 'housing', icon: EXPENSE_ICON.housing },
  { value: 'food', icon: EXPENSE_ICON.food },
  { value: 'utilities', icon: EXPENSE_ICON.utilities },
  { value: 'transport', icon: EXPENSE_ICON.transport },
  { value: 'education', icon: EXPENSE_ICON.education },
  { value: 'health', icon: EXPENSE_ICON.health },
  { value: 'other', icon: EXPENSE_ICON.other }
];

export const DEBT_OPTIONS: readonly EntryOption<DebtType>[] = [
  { value: 'credit-card', icon: DEBT_ICON['credit-card'] },
  { value: 'personal-loan', icon: DEBT_ICON['personal-loan'] },
  { value: 'vehicle', icon: DEBT_ICON.vehicle },
  { value: 'mortgage', icon: DEBT_ICON.mortgage },
  { value: 'store-credit', icon: DEBT_ICON['store-credit'] },
  { value: 'other', icon: DEBT_ICON.other }
];

export const AVAILABLE_INCOME_CLASS = {
  positive: 'text-lg font-extrabold tabular-nums text-surface-900 dark:text-surface-0',
  negative: 'text-lg font-extrabold tabular-nums text-red-600 dark:text-red-400'
};
