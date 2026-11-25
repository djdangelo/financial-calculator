import { OfferVerification } from '../models';
import { buildDueDates, summarizeOfferVerification } from './offer-verification.function';
import { createOfferVerification } from './verification-factory.function';

describe('offer verification', () => {
  const verification: OfferVerification = {
    ...createOfferVerification('USD', '2026-11-24'),
    amount: 10000,
    annualRatePercent: 12,
    termMonths: 12,
    firstPaymentDate: '2027-01-31'
  };

  it('dates every payment from the first one', () => {
    expect(buildDueDates('2027-01-31', 3)).toEqual(['2027-01-31', '2027-02-28', '2027-03-31']);
    expect(buildDueDates('2027-01-31', 0)).toEqual([]);
  });

  it('summarizes a plain offer like the loan analysis', () => {
    const summary = summarizeOfferVerification(verification);

    expect(summary.currency).toBe('USD');
    expect(summary.cost.monthlyPayment).toBe(888.49);
    expect(summary.dueDates.length).toBe(12);
    expect(summary.dueDates[11]).toBe('2027-12-31');
    expect(summary.yearlyPayments.length).toBe(1);
    expect(summary.quote).toBeNull();
    expect(summary.paidOffEarly).toBeFalse();
  });

  it('applies the special conditions of the offer', () => {
    const summary = summarizeOfferVerification({
      ...verification,
      graceMonths: 2,
      balanceInsuranceRatePercent: 0.1,
      rateChangeMonth: 7,
      rateChangeAnnualRatePercent: 18
    });

    expect(summary.cost.schedule[0].principal).toBe(0);
    expect(summary.cost.schedule[0].insurance).toBe(10);
    expect(summary.cost.levelPayment).toBe(1055.82);
    expect(summary.cost.schedule[11].balance).toBe(0);
  });

  it('flags an early payoff with extra payments', () => {
    const summary = summarizeOfferVerification({ ...verification, extraMonthlyPayment: 500 });

    expect(summary.paidOffEarly).toBeTrue();
    expect(summary.dueDates.length).toBe(summary.cost.schedule.length);
  });

  it('compares the payment the bank quoted', () => {
    const summary = summarizeOfferVerification({ ...verification, quotedPayment: 950 });

    expect(summary.quote?.status).toBe('higher');
    expect(summary.quote?.calculatedPayment).toBe(888.49);
  });
});
