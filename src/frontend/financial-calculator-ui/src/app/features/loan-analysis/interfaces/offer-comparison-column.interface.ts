import { OfferComparison } from './offer-comparison.interface';

export interface OfferComparisonColumn extends OfferComparison {
  active: boolean;
  columnClass: string;
  verdictIcon: string;
}
