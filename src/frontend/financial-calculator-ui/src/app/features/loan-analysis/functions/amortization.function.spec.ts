import { sumAmounts } from '@core/functions/finance.function';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { buildAmortizationSchedule } from './amortization.function';

describe('buildAmortizationSchedule', () => {
  const terms: LoanTerms = { principal: 10000, annualRatePercent: 12, termMonths: 12 };

  it('creates one row per month', () => {
    const schedule = buildAmortizationSchedule(terms);
    expect(schedule.length).toBe(12);
    expect(schedule.map(row => row.period)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('splits the first payments between interest and principal', () => {
    const [first, second] = buildAmortizationSchedule(terms);

    expect(first).toEqual({
      period: 1, payment: 888.49, interest: 100, principal: 788.49, insurance: 0, totalPayment: 888.49, balance: 9211.51
    });
    expect(second.interest).toBe(92.12);
    expect(second.principal).toBe(796.37);
    expect(second.balance).toBe(8415.14);
  });

  it('pays the whole principal and ends with a zero balance', () => {
    const schedule = buildAmortizationSchedule(terms);

    expect(sumAmounts(schedule.map(row => row.principal))).toBeCloseTo(10000, 2);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });

  it('keeps every payment within one unit of the level payment', () => {
    const schedule = buildAmortizationSchedule({ principal: 200000, annualRatePercent: 31, termMonths: 60 });
    const levelPayment = schedule[0].payment;

    expect(schedule.length).toBe(60);
    expect(schedule.every(row => Math.abs(row.payment - levelPayment) < 1)).toBeTrue();
    expect(schedule[59].balance).toBe(0);
  });

  it('adds the monthly insurance to the total payment', () => {
    const [first] = buildAmortizationSchedule(terms, 50);

    expect(first.insurance).toBe(50);
    expect(first.totalPayment).toBe(938.49);
  });

  it('pays only principal when the rate is zero', () => {
    const schedule = buildAmortizationSchedule({ principal: 12000, annualRatePercent: 0, termMonths: 12 });

    expect(schedule.every(row => row.interest === 0 && row.payment === 1000)).toBeTrue();
  });

  it('returns no rows without a valid loan', () => {
    expect(buildAmortizationSchedule({ principal: 0, annualRatePercent: 12, termMonths: 12 })).toEqual([]);
    expect(buildAmortizationSchedule({ principal: 10000, annualRatePercent: 12, termMonths: 0 })).toEqual([]);
  });
});
