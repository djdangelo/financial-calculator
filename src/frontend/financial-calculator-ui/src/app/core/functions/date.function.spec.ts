import { formatIsoDate, toIsoDate } from './date.function';

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
});
