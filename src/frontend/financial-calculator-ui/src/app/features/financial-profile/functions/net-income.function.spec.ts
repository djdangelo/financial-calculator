import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Income } from '../models';
import { calculateIncomeContribution, calculateNetMonthlyIncome } from './net-income.function';

describe('net income functions', () => {
  const rates: ExchangeRates = { base: 'USD', unitsPerBase: { USD: 1, HNL: 25 }, date: '2026-01-01' };
  const salary: Income = { id: 'salary', type: 'salary', currency: 'HNL', monthlyAmount: 25000, monthlyCosts: 0 };
  const business: Income = { id: 'business', type: 'business', currency: 'HNL', monthlyAmount: 40000, monthlyCosts: 28000 };
  const remittance: Income = { id: 'other', type: 'other', currency: 'USD', monthlyAmount: 200, monthlyCosts: 0 };

  it('subtracts the business costs from the sales', () => {
    expect(calculateIncomeContribution(business)).toBe(12000);
  });

  it('adds every income converted to lempiras', () => {
    expect(calculateNetMonthlyIncome([salary, business, remittance], 'HNL', rates)).toBe(42000);
  });

  it('adds every income converted to dollars', () => {
    expect(calculateNetMonthlyIncome([salary, business, remittance], 'USD', rates)).toBe(1680);
  });

  it('returns zero without incomes', () => {
    expect(calculateNetMonthlyIncome([], 'HNL', rates)).toBe(0);
  });

  it('lets a losing business reduce the income', () => {
    const losingBusiness: Income = { ...business, monthlyCosts: 45000 };
    expect(calculateNetMonthlyIncome([salary, losingBusiness], 'HNL', rates)).toBe(20000);
  });
});
