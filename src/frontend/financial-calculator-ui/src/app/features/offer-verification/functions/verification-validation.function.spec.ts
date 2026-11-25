import { OfferVerification } from '../models';
import { createOfferVerification } from './verification-factory.function';
import {
  isBalanceInsuranceValid,
  isGraceValid,
  isOfferVerificationValid,
  isRateChangeValid
} from './verification-validation.function';

describe('offer verification validation', () => {
  const verification: OfferVerification = {
    ...createOfferVerification('HNL', '2026-11-24'),
    amount: 100000,
    annualRatePercent: 18,
    termMonths: 36
  };

  it('starts with the first payment one month ahead', () => {
    expect(verification.firstPaymentDate).toBe('2026-12-24');
  });

  it('accepts a complete offer', () => {
    expect(isOfferVerificationValid(verification)).toBeTrue();
  });

  it('rejects an offer without amount, rate or date', () => {
    expect(isOfferVerificationValid({ ...verification, amount: 0 })).toBeFalse();
    expect(isOfferVerificationValid({ ...verification, annualRatePercent: 0 })).toBeFalse();
    expect(isOfferVerificationValid({ ...verification, firstPaymentDate: '' })).toBeFalse();
  });

  it('keeps the grace period shorter than the term', () => {
    expect(isGraceValid(0, 36)).toBeTrue();
    expect(isGraceValid(6, 36)).toBeTrue();
    expect(isGraceValid(36, 36)).toBeFalse();
    expect(isGraceValid(1.5, 36)).toBeFalse();
  });

  it('needs both the month and the new rate for a rate change', () => {
    expect(isRateChangeValid(verification)).toBeTrue();
    expect(isRateChangeValid({ ...verification, rateChangeMonth: 13, rateChangeAnnualRatePercent: 24 })).toBeTrue();
    expect(isRateChangeValid({ ...verification, rateChangeMonth: 13 })).toBeFalse();
    expect(isRateChangeValid({ ...verification, rateChangeAnnualRatePercent: 24 })).toBeFalse();
    expect(isRateChangeValid({ ...verification, rateChangeMonth: 1, rateChangeAnnualRatePercent: 24 })).toBeFalse();
    expect(isRateChangeValid({ ...verification, rateChangeMonth: 37, rateChangeAnnualRatePercent: 24 })).toBeFalse();
  });

  it('limits the insurance over the balance', () => {
    expect(isBalanceInsuranceValid(0.05)).toBeTrue();
    expect(isBalanceInsuranceValid(-1)).toBeFalse();
    expect(isBalanceInsuranceValid(50)).toBeFalse();
  });
});
