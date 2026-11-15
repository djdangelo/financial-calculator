import { CurrencyCode } from '@core/@types/currency-code.type';
import { StoredRecord } from '@core/interfaces/stored-record.interface';
import { FeeMode } from '../@types/fee-mode.type';

export interface LoanOffer extends StoredRecord {
  bankName: string;
  currency: CurrencyCode;
  amount: number;
  annualRatePercent: number;
  termMonths: number;
  disbursementFeePercent: number;
  feeMode: FeeMode;
  monthlyInsurance: number;
  otherInitialCharges: number;
}
