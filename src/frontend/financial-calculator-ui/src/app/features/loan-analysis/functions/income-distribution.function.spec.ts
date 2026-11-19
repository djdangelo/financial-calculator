import { buildIncomeDistribution } from './income-distribution.function';

describe('buildIncomeDistribution', () => {
  it('splits the income into expenses, payments and what is left', () => {
    const slices = buildIncomeDistribution({
      netIncome: 30000,
      expenses: 10000,
      currentDebtPayments: 2000,
      newLoanPayment: 9505.96
    });

    expect(slices.map(slice => slice.key)).toEqual(['expenses', 'current-debts', 'new-payment', 'available']);
    expect(slices[3].amount).toBe(8494.04);
    expect(slices[0].sharePercent).toBeCloseTo(33.33, 2);
    expect(slices[2].sharePercent).toBeCloseTo(31.69, 2);
  });

  it('measures the shares against the commitments when they exceed the income', () => {
    const slices = buildIncomeDistribution({ netIncome: 10000, expenses: 8000, currentDebtPayments: 0, newLoanPayment: 4000 });

    expect(slices.map(slice => slice.key)).toEqual(['expenses', 'new-payment']);
    expect(slices[0].sharePercent).toBeCloseTo(66.67, 2);
    expect(slices[1].sharePercent).toBeCloseTo(33.33, 2);
  });

  it('returns no shares when there is no income nor commitments', () => {
    expect(buildIncomeDistribution({ netIncome: 0, expenses: 0, currentDebtPayments: 0, newLoanPayment: 0 })).toEqual([]);
  });
});
