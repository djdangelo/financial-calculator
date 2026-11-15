import { CurrencyCode } from '@core/@types/currency-code.type';
import { StoredRecord } from '@core/interfaces/stored-record.interface';
import { IncomeType } from '../@types/income-type.type';

export interface Income extends StoredRecord {
  type: IncomeType;
  currency: CurrencyCode;
  monthlyAmount: number;
  monthlyCosts: number;
}
