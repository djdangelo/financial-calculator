import { LoanOffer } from '@features/loan-offers/models';
import { LoanAnalysis } from './loan-analysis.interface';

export interface OfferComparison {
  offer: LoanOffer;
  analysis: LoanAnalysis;
  position: number;
}
