import { roundMoney, sumAmounts } from '@core/functions/finance.function';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { buildAmortizationSchedule, calculateRegularPayment } from './amortization.function';

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
    const [first] = buildAmortizationSchedule(terms, { monthlyInsurance: 50 });

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

  it('charges only interest during the grace months', () => {
    const schedule = buildAmortizationSchedule(terms, { graceMonths: 2 });

    expect(schedule.length).toBe(12);
    expect(schedule[0]).toEqual(jasmine.objectContaining({ interest: 100, principal: 0, payment: 100, balance: 10000 }));
    expect(schedule[1].principal).toBe(0);
    expect(schedule[2].payment).toBe(1055.82);
    expect(schedule[11].balance).toBe(0);
  });

  it('recalculates the payment when the rate changes', () => {
    const schedule = buildAmortizationSchedule(terms, { rateChange: { fromPeriod: 7, annualRatePercent: 24 } });

    expect(schedule[5].payment).toBe(888.49);
    expect(schedule[6].interest).toBe(roundMoney(schedule[5].balance * 0.02));
    expect(schedule[6].payment).toBeGreaterThan(888.49);
    expect(schedule[11].balance).toBe(0);
  });

  it('uses the new rate from the first payment when it changes during the grace period', () => {
    const options = { graceMonths: 3, rateChange: { fromPeriod: 2, annualRatePercent: 24 } };
    const schedule = buildAmortizationSchedule(terms, options);

    expect(schedule[0].interest).toBe(100);
    expect(schedule[1].interest).toBe(200);
    expect(schedule[3].payment).toBe(calculateRegularPayment(terms, options));
  });

  it('charges insurance over the outstanding balance', () => {
    const schedule = buildAmortizationSchedule(terms, { monthlyInsurance: 10, balanceInsuranceRatePercent: 0.1 });

    expect(schedule[0].insurance).toBe(20);
    expect(schedule[1].insurance).toBe(roundMoney(10 + schedule[0].balance * 0.001));
    expect(schedule[11].insurance).toBeLessThan(schedule[0].insurance);
  });

  it('pays the loan off early with extra monthly payments', () => {
    const schedule = buildAmortizationSchedule(terms, { extraMonthlyPayment: 500 });

    expect(schedule.length).toBeLessThan(12);
    expect(schedule[0].principal).toBe(1288.49);
    expect(sumAmounts(schedule.map(row => row.principal))).toBeCloseTo(10000, 2);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });
});

describe('calculateRegularPayment', () => {
  const terms: LoanTerms = { principal: 10000, annualRatePercent: 12, termMonths: 12 };

  it('matches the level payment without options', () => {
    expect(calculateRegularPayment(terms)).toBe(888.49);
  });

  it('spreads the principal over the months left after the grace period', () => {
    expect(calculateRegularPayment(terms, { graceMonths: 2 })).toBe(1055.82);
  });
});
