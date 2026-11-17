import { resolveBurdenStatus, toBarWidthPercent } from './burden-status.function';

describe('burden status functions', () => {
  it('marks a burden over the limit', () => {
    expect(resolveBurdenStatus(80, 80)).toBe('within');
    expect(resolveBurdenStatus(80.01, 80)).toBe('over');
    expect(resolveBurdenStatus(Number.POSITIVE_INFINITY, 80)).toBe('over');
  });

  it('keeps the bar width between zero and one hundred', () => {
    expect(toBarWidthPercent(45)).toBe(45);
    expect(toBarWidthPercent(130)).toBe(100);
    expect(toBarWidthPercent(Number.POSITIVE_INFINITY)).toBe(100);
    expect(toBarWidthPercent(-5)).toBe(0);
  });
});
