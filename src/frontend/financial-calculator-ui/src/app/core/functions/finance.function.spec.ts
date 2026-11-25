import {
  formatPercent,
  monthlyRateFromAnnualPercent,
  percentToRatio,
  ratioToPercent,
  roundMoney,
  sumAmounts
} from './finance.function';

describe('finance functions', () => {
  it('rounds money to two decimals', () => {
    expect(roundMoney(888.4879)).toBe(888.49);
    expect(roundMoney(1.005)).toBe(1.01);
    expect(roundMoney(100)).toBe(100);
  });

  it('converts between percent and ratio', () => {
    expect(percentToRatio(80)).toBe(0.8);
    expect(ratioToPercent(0.4)).toBe(40);
  });

  it('derives the monthly rate from the annual percent', () => {
    expect(monthlyRateFromAnnualPercent(24)).toBeCloseTo(0.02, 10);
    expect(monthlyRateFromAnnualPercent(0)).toBe(0);
  });

  it('sums amounts', () => {
    expect(sumAmounts([100, 250.5, 49.5])).toBe(400);
    expect(sumAmounts([])).toBe(0);
  });

  it('formats a percent with up to one decimal', () => {
    expect(formatPercent(40)).toBe('40 %');
    expect(formatPercent(33.333)).toBe('33.3 %');
    expect(formatPercent(0.0525, 4)).toBe('0.0525 %');
    expect(formatPercent(1250)).toBe('1,250 %');
  });
});
