import { CurrencyCode } from '@core/@types/currency-code.type';
import { DatedRecord } from '@core/interfaces/dated-record.interface';
import { FeeMode } from '@features/loan-offers/@types/fee-mode.type';

export interface OfferVerification extends DatedRecord {
  bankName: string;
  currency: CurrencyCode;
  amount: number;
  annualRatePercent: number;
  termMonths: number;
  disbursementFeePercent: number;
  feeMode: FeeMode;
  monthlyInsurance: number;
  otherInitialCharges: number;
  firstPaymentDate: string;
  quotedPayment: number;
  balanceInsuranceRatePercent: number;
  graceMonths: number;
  rateChangeMonth: number;
  rateChangeAnnualRatePercent: number;
  extraMonthlyPayment: number;
}
