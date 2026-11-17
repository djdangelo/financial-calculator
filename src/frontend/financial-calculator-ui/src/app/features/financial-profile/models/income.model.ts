import { CurrencyCode } from '@core/@types/currency-code.type';
import { DatedRecord } from '@core/interfaces/dated-record.interface';
import { IncomeType } from '../@types/income-type.type';

export interface Income extends DatedRecord {
  type: IncomeType;
  description: string;
  currency: CurrencyCode;
  monthlyAmount: number;
  monthlyCosts: number;
}
