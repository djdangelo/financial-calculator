import { CurrencyCode } from '@core/@types/currency-code.type';
import { DatedRecord } from '@core/interfaces/dated-record.interface';
import { FeeMode } from '../@types/fee-mode.type';

export interface LoanOffer extends DatedRecord {
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
