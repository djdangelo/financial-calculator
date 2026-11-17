import { LoanOffer } from '../models';
import { hasPositiveDisbursement, isAnnualRateValid, isLoanOfferValid, isTermValid } from './offer-validation.function';

describe('offer validation functions', () => {
  const offer: LoanOffer = {
    id: 'offer',
    createdAt: 1,
    bankName: '',
    currency: 'HNL',
    amount: 100000,
    annualRatePercent: 24,
    termMonths: 36,
    disbursementFeePercent: 2,
    feeMode: 'deducted',
    monthlyInsurance: 0,
    otherInitialCharges: 0
  };

  it('accepts a complete offer', () => {
    expect(isLoanOfferValid(offer)).toBeTrue();
  });

  it('requires an amount, a rate and a term', () => {
    expect(isLoanOfferValid({ ...offer, amount: 0 })).toBeFalse();
    expect(isLoanOfferValid({ ...offer, annualRatePercent: 0 })).toBeFalse();
    expect(isLoanOfferValid({ ...offer, termMonths: 0 })).toBeFalse();
  });

  it('checks the rate and term limits', () => {
    expect(isAnnualRateValid(999)).toBeTrue();
    expect(isAnnualRateValid(1000)).toBeFalse();
    expect(isTermValid(60)).toBeTrue();
    expect(isTermValid(12.5)).toBeFalse();
    expect(isTermValid(601)).toBeFalse();
  });

  it('rejects an offer whose fee and charges leave nothing to receive', () => {
    expect(isLoanOfferValid({ ...offer, disbursementFeePercent: 100 })).toBeFalse();
    expect(hasPositiveDisbursement({ ...offer, otherInitialCharges: 98000 })).toBeFalse();
    expect(hasPositiveDisbursement({ ...offer, otherInitialCharges: 97000 })).toBeTrue();
  });

  it('rejects negative optional costs', () => {
    expect(isLoanOfferValid({ ...offer, monthlyInsurance: -1 })).toBeFalse();
    expect(isLoanOfferValid({ ...offer, otherInitialCharges: -1 })).toBeFalse();
  });
});
