import { LoanOffer } from '@features/loan-offers/models';
import { LoanAnalysis } from './loan-analysis.interface';
import { YearlyPaymentSummary } from './yearly-payment-summary.interface';

export interface ResultReportInput {
  analysis: LoanAnalysis;
  offer: LoanOffer;
  yearlyPayments: readonly YearlyPaymentSummary[];
  isConsolidating: boolean;
  generatedOn: string;
  isoDate: string;
}
