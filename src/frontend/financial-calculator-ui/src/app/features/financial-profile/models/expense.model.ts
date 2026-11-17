import { CurrencyCode } from '@core/@types/currency-code.type';
import { DatedRecord } from '@core/interfaces/dated-record.interface';
import { ExpenseCategory } from '../@types/expense-category.type';

export interface Expense extends DatedRecord {
  category: ExpenseCategory;
  description: string;
  currency: CurrencyCode;
  monthlyAmount: number;
}
