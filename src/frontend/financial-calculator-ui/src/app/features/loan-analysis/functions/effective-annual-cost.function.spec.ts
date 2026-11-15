import {
  calculateEffectiveAnnualCostPercent,
  calculateMonthlyInternalRate,
  calculatePresentValue
} from './effective-annual-cost.function';

describe('effective annual cost functions', () => {
  const twelvePayments = Array<number>(12).fill(888.49);

  it('discounts the payments to their present value', () => {
    expect(calculatePresentValue([110, 121], 0.1)).toBeCloseTo(200, 8);
    expect(calculatePresentValue([100, 100], 0)).toBe(200);
  });

  it('finds the contract rate when there are no extra charges', () => {
    expect(calculateMonthlyInternalRate(10000, twelvePayments)).toBeCloseTo(0.01, 5);
  });

  it('annualizes 12% nominal into 12.68% effective', () => {
    expect(calculateEffectiveAnnualCostPercent(10000, twelvePayments)).toBeCloseTo(12.68, 1);
  });

  it('raises the cost when the fee is deducted from the money received', () => {
    const cost = calculateEffectiveAnnualCostPercent(9800, twelvePayments);

    expect(cost).toBeGreaterThan(16.9);
    expect(cost).toBeLessThan(17.2);
  });

  it('returns a rate that reproduces the money received', () => {
    const monthlyRate = calculateMonthlyInternalRate(9800, twelvePayments);

    expect(calculatePresentValue(twelvePayments, monthlyRate)).toBeCloseTo(9800, 4);
  });

  it('returns zero when the payments do not exceed the money received', () => {
    expect(calculateEffectiveAnnualCostPercent(12000, Array<number>(12).fill(1000))).toBe(0);
    expect(calculateEffectiveAnnualCostPercent(0, twelvePayments)).toBe(0);
  });
});
