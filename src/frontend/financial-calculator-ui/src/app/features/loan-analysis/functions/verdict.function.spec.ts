import { DEFAULT_BURDEN_LIMITS } from '@core/constants/market.constant';
import { resolveVerdict } from './verdict.function';

describe('resolveVerdict', () => {
  it('approves a loan that respects both limits', () => {
    expect(resolveVerdict({ totalBurdenPercent: 65, debtBurdenPercent: 25 }, DEFAULT_BURDEN_LIMITS)).toBe('can-take');
  });

  it('approves a loan exactly on both limits', () => {
    expect(resolveVerdict({ totalBurdenPercent: 80, debtBurdenPercent: 40 }, DEFAULT_BURDEN_LIMITS)).toBe('can-take');
  });

  it('asks for caution when only the debt limit is exceeded', () => {
    expect(resolveVerdict({ totalBurdenPercent: 78, debtBurdenPercent: 45 }, DEFAULT_BURDEN_LIMITS)).toBe('caution');
  });

  it('rejects a loan that exceeds the total limit', () => {
    expect(resolveVerdict({ totalBurdenPercent: 85, debtBurdenPercent: 30 }, DEFAULT_BURDEN_LIMITS)).toBe('not-recommended');
  });

  it('rejects a loan without income', () => {
    const indicators = { totalBurdenPercent: Number.POSITIVE_INFINITY, debtBurdenPercent: Number.POSITIVE_INFINITY };
    expect(resolveVerdict(indicators, DEFAULT_BURDEN_LIMITS)).toBe('not-recommended');
  });

  it('uses the limits chosen by the user', () => {
    const strictLimits = { totalBurdenPercent: 70, debtBurdenPercent: 30 };
    expect(resolveVerdict({ totalBurdenPercent: 75, debtBurdenPercent: 25 }, strictLimits)).toBe('not-recommended');
  });
});
