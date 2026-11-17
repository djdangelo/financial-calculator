import { CurrencyCode } from '@core/@types/currency-code.type';
import { createRecordId } from '@core/functions/record.function';
import { DebtType } from '../@types/debt-type.type';
import { ExpenseCategory } from '../@types/expense-category.type';
import { IncomeType } from '../@types/income-type.type';
import { Debt, Expense, Income } from '../models';

export function createIncome(type: IncomeType, currency: CurrencyCode): Income {
  return { id: createRecordId(), createdAt: Date.now(), type, description: '', currency, monthlyAmount: 0, monthlyCosts: 0 };
}

export function createExpense(category: ExpenseCategory, currency: CurrencyCode): Expense {
  return { id: createRecordId(), createdAt: Date.now(), category, description: '', currency, monthlyAmount: 0 };
}

export function createDebt(type: DebtType, currency: CurrencyCode): Debt {
  return {
    id: createRecordId(),
    createdAt: Date.now(),
    type,
    description: '',
    currency,
    monthlyPayment: 0,
    balance: 0,
    annualRatePercent: null,
    remainingMonths: null
  };
}
