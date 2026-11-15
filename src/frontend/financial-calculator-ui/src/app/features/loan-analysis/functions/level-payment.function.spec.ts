import { calculateLevelPayment } from './level-payment.function';

describe('calculateLevelPayment', () => {
  it('matches the reference payment of 10,000 at 12% for 12 months', () => {
    expect(calculateLevelPayment({ principal: 10000, annualRatePercent: 12, termMonths: 12 })).toBe(888.49);
  });

  it('matches the reference payment of 100,000 at 24% for 12 months', () => {
    expect(calculateLevelPayment({ principal: 100000, annualRatePercent: 24, termMonths: 12 })).toBe(9455.96);
  });

  it('splits the principal evenly when the rate is zero', () => {
    expect(calculateLevelPayment({ principal: 12000, annualRatePercent: 0, termMonths: 12 })).toBe(1000);
  });

  it('returns zero without a valid principal or term', () => {
    expect(calculateLevelPayment({ principal: 0, annualRatePercent: 24, termMonths: 12 })).toBe(0);
    expect(calculateLevelPayment({ principal: 10000, annualRatePercent: 24, termMonths: 0 })).toBe(0);
  });
});
