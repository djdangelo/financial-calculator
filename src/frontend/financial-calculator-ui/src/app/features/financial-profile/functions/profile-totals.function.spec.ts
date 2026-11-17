import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Debt, Expense } from '../models';
import {
  calculateAvailableIncome,
  calculateDebtBalance,
  calculateMonthlyDebtPayments,
  calculateMonthlyExpenses,
  usesAnotherCurrency
} from './profile-totals.function';

describe('profile total functions', () => {
  const rates: ExchangeRates = { base: 'USD', unitsPerBase: { USD: 1, HNL: 25 }, date: '2026-01-01' };
  const rent: Expense = { id: 'rent', createdAt: 1, category: 'housing', description: '', currency: 'HNL', monthlyAmount: 8000 };
  const streaming: Expense = { id: 'tv', createdAt: 2, category: 'utilities', description: '', currency: 'USD', monthlyAmount: 20 };
  const card: Debt = {
    id: 'card', createdAt: 1, type: 'credit-card', description: '', currency: 'HNL',
    monthlyPayment: 3000, balance: 45000, annualRatePercent: 48, remainingMonths: null
  };
  const car: Debt = {
    id: 'car', createdAt: 2, type: 'vehicle', description: '', currency: 'USD',
    monthlyPayment: 300, balance: 9000, annualRatePercent: null, remainingMonths: 30
  };

  it('adds the expenses in the requested currency', () => {
    expect(calculateMonthlyExpenses([rent, streaming], 'HNL', rates)).toBe(8500);
    expect(calculateMonthlyExpenses([rent, streaming], 'USD', rates)).toBe(340);
  });

  it('adds the debt payments in the requested currency', () => {
    expect(calculateMonthlyDebtPayments([card, car], 'HNL', rates)).toBe(10500);
  });

  it('adds the debt balances in the requested currency', () => {
    expect(calculateDebtBalance([card, car], 'HNL', rates)).toBe(270000);
  });

  it('leaves what remains after expenses and payments', () => {
    expect(calculateAvailableIncome(42000, 8500, 10500)).toBe(23000);
    expect(calculateAvailableIncome(10000, 8500, 10500)).toBe(-9000);
  });

  it('detects amounts in another currency', () => {
    expect(usesAnotherCurrency(['HNL', 'USD'], 'HNL')).toBeTrue();
    expect(usesAnotherCurrency(['HNL', 'HNL'], 'HNL')).toBeFalse();
    expect(usesAnotherCurrency([], 'HNL')).toBeFalse();
  });
});
