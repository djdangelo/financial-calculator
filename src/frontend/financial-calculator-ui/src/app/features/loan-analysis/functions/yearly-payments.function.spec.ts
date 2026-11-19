import { AmortizationRow } from '../interfaces/amortization-row.interface';
import { summarizePaymentsByYear } from './yearly-payments.function';

describe('summarizePaymentsByYear', () => {
  const rows: AmortizationRow[] = Array.from({ length: 13 }, (_, index) => ({
    period: index + 1,
    payment: 15,
    interest: 5,
    principal: 10,
    insurance: 1,
    totalPayment: 16,
    balance: 0
  }));

  it('adds the principal, interest and insurance of each year', () => {
    expect(summarizePaymentsByYear(rows)).toEqual([
      { year: 1, principal: 120, interest: 60, insurance: 12 },
      { year: 2, principal: 10, interest: 5, insurance: 1 }
    ]);
  });

  it('returns no years for an empty schedule', () => {
    expect(summarizePaymentsByYear([])).toEqual([]);
  });
});
