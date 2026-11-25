import { addMonthsToIsoDate, formatIsoDate, isIsoDate, toIsoDate } from './date.function';

describe('date functions', () => {
  it('builds the ISO date from the local date parts', () => {
    expect(toIsoDate(new Date(2026, 8, 5))).toBe('2026-09-05');
    expect(toIsoDate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('formats an ISO date without shifting the day', () => {
    expect(formatIsoDate('2026-09-11', 'es')).toContain('11');
    expect(formatIsoDate('2026-09-11', 'es')).toContain('2026');
    expect(formatIsoDate('2026-09-11', 'en')).toBe('Sep 11, 2026');
  });

  it('recognizes only complete ISO dates', () => {
    expect(isIsoDate('2026-09-11')).toBeTrue();
    expect(isIsoDate('')).toBeFalse();
    expect(isIsoDate('2026-9-11')).toBeFalse();
    expect(isIsoDate('2026-13-40')).toBeFalse();
  });

  it('adds months and crosses the year', () => {
    expect(addMonthsToIsoDate('2026-01-15', 0)).toBe('2026-01-15');
    expect(addMonthsToIsoDate('2026-11-15', 3)).toBe('2027-02-15');
  });

  it('keeps the day inside shorter months', () => {
    expect(addMonthsToIsoDate('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonthsToIsoDate('2028-01-31', 1)).toBe('2028-02-29');
    expect(addMonthsToIsoDate('2026-01-31', 2)).toBe('2026-03-31');
  });
});
