import { calculateBurdenPercent, calculateDebtIndicators } from './debt-indicators.function';

describe('debt indicator functions', () => {
  it('measures expenses plus every payment against the income', () => {
    const indicators = calculateDebtIndicators({
      netIncome: 30000, expenses: 15000, currentDebtPayments: 4000, newLoanPayment: 5000
    });

    expect(indicators.totalBurdenPercent).toBeCloseTo(80, 10);
    expect(indicators.debtBurdenPercent).toBeCloseTo(30, 10);
  });

  it('counts only the new payment when there are no current debts', () => {
    const indicators = calculateDebtIndicators({
      netIncome: 20000, expenses: 8000, currentDebtPayments: 0, newLoanPayment: 2000
    });

    expect(indicators.totalBurdenPercent).toBeCloseTo(50, 10);
    expect(indicators.debtBurdenPercent).toBeCloseTo(10, 10);
  });

  it('reports an unbounded burden when there is no income', () => {
    expect(calculateBurdenPercent(5000, 0)).toBe(Number.POSITIVE_INFINITY);
    expect(calculateBurdenPercent(5000, -100)).toBe(Number.POSITIVE_INFINITY);
  });

  it('reports no burden without income or commitments', () => {
    expect(calculateBurdenPercent(0, 0)).toBe(0);
  });
});
