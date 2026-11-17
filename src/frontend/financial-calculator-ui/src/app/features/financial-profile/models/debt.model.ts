import { CurrencyCode } from '@core/@types/currency-code.type';
import { DatedRecord } from '@core/interfaces/dated-record.interface';
import { DebtType } from '../@types/debt-type.type';

export interface Debt extends DatedRecord {
  type: DebtType;
  description: string;
  currency: CurrencyCode;
  monthlyPayment: number;
  balance: number;
  annualRatePercent: number | null;
  remainingMonths: number | null;
}
