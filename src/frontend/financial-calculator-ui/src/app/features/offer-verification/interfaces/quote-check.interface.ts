import { QuoteStatus } from '../@types/quote-status.type';

export interface QuoteCheck {
  quotedPayment: number;
  calculatedPayment: number;
  difference: number;
  differenceOverTerm: number;
  status: QuoteStatus;
  impliedAnnualRatePercent: number | null;
}
