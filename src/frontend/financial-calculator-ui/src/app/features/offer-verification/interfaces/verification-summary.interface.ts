import { CurrencyCode } from '@core/@types/currency-code.type';
import { LoanCostSummary } from '@features/loan-analysis/interfaces/loan-cost-summary.interface';
import { YearlyPaymentSummary } from '@features/loan-analysis/interfaces/yearly-payment-summary.interface';
import { QuoteCheck } from './quote-check.interface';

export interface VerificationSummary {
  currency: CurrencyCode;
  cost: LoanCostSummary;
  yearlyPayments: YearlyPaymentSummary[];
  dueDates: string[];
  quote: QuoteCheck | null;
  paidOffEarly: boolean;
}
