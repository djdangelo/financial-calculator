import { OfferVerification } from '../models';
import { VerificationSummary } from './verification-summary.interface';

export interface VerificationReportInput {
  verification: OfferVerification;
  summary: VerificationSummary;
  formattedDueDates: readonly string[];
  generatedOn: string;
  isoDate: string;
}
