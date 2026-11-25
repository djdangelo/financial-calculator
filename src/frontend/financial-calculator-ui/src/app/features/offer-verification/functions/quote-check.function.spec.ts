import { summarizeLoanCost } from '@features/loan-analysis/functions/loan-cost.function';
import { OfferVerification } from '../models';
import { checkQuotedPayment, findAnnualRateForPayment, resolveQuoteStatus } from './quote-check.function';
import { createOfferVerification, toLoanOffer } from './verification-factory.function';

describe('quote check', () => {
  const verification: OfferVerification = {
    ...createOfferVerification('HNL', '2026-11-24'),
    amount: 10000,
    annualRatePercent: 12,
    termMonths: 12
  };
  const cost = summarizeLoanCost(toLoanOffer(verification));

  it('finds the annual rate behind a level payment', () => {
    expect(findAnnualRateForPayment(10000, 12, 888.49)).toBeCloseTo(12, 1);
    expect(findAnnualRateForPayment(12000, 12, 1000)).toBeCloseTo(0, 3);
  });

  it('cannot find a rate for a payment below the principal split in equal parts', () => {
    expect(findAnnualRateForPayment(10000, 12, 800)).toBeNull();
    expect(findAnnualRateForPayment(0, 12, 800)).toBeNull();
  });

  it('accepts small rounding differences as a match', () => {
    expect(resolveQuoteStatus(0.5)).toBe('matches');
    expect(resolveQuoteStatus(-1)).toBe('matches');
    expect(resolveQuoteStatus(25)).toBe('higher');
    expect(resolveQuoteStatus(-25)).toBe('lower');
  });

  it('skips the check when the bank payment is missing', () => {
    expect(checkQuotedPayment(verification, cost)).toBeNull();
  });

  it('confirms a bank payment that matches the calculation', () => {
    const quote = checkQuotedPayment({ ...verification, quotedPayment: 888.49 }, cost);

    expect(quote?.status).toBe('matches');
    expect(quote?.impliedAnnualRatePercent).toBeNull();
  });

  it('measures how much more the bank charges and the rate it implies', () => {
    const quote = checkQuotedPayment({ ...verification, quotedPayment: 920 }, cost);

    expect(quote?.status).toBe('higher');
    expect(quote?.difference).toBe(31.51);
    expect(quote?.differenceOverTerm).toBe(378.12);
    expect(quote?.impliedAnnualRatePercent).toBeGreaterThan(12);
  });

  it('leaves the insurance out of the implied rate', () => {
    const insured = { ...verification, monthlyInsurance: 50, quotedPayment: 1000 };
    const quote = checkQuotedPayment(insured, summarizeLoanCost(toLoanOffer(insured)));

    expect(quote?.status).toBe('higher');
    expect(quote?.impliedAnnualRatePercent).toBeCloseTo(findAnnualRateForPayment(10000, 12, 950) ?? 0, 6);
  });
});
