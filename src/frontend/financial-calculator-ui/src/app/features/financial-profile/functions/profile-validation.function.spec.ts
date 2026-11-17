import { Debt, Expense, Income } from '../models';
import {
  isDebtValid,
  isDebtsStepComplete,
  isExpensesStepComplete,
  isIncomeStepComplete,
  isIncomeValid
} from './profile-validation.function';

describe('profile validation functions', () => {
  const income: Income = {
    id: 'income', createdAt: 1, type: 'salary', description: '', currency: 'HNL', monthlyAmount: 25000, monthlyCosts: 0
  };
  const expense: Expense = {
    id: 'expense', createdAt: 1, category: 'food', description: '', currency: 'HNL', monthlyAmount: 6000
  };
  const debt: Debt = {
    id: 'debt', createdAt: 1, type: 'credit-card', description: '', currency: 'HNL',
    monthlyPayment: 3000, balance: 45000, annualRatePercent: null, remainingMonths: null
  };

  it('requires an amount above zero for an income', () => {
    expect(isIncomeValid(income)).toBeTrue();
    expect(isIncomeValid({ ...income, monthlyAmount: 0 })).toBeFalse();
  });

  it('requires at least one valid income', () => {
    expect(isIncomeStepComplete([])).toBeFalse();
    expect(isIncomeStepComplete([income])).toBeTrue();
    expect(isIncomeStepComplete([income, { ...income, id: 'empty', monthlyAmount: 0 }])).toBeFalse();
  });

  it('requires at least one valid expense', () => {
    expect(isExpensesStepComplete([])).toBeFalse();
    expect(isExpensesStepComplete([expense])).toBeTrue();
    expect(isExpensesStepComplete([{ ...expense, monthlyAmount: 0 }])).toBeFalse();
  });

  it('requires the payment and the balance of a debt', () => {
    expect(isDebtValid(debt)).toBeTrue();
    expect(isDebtValid({ ...debt, monthlyPayment: 0 })).toBeFalse();
    expect(isDebtValid({ ...debt, balance: 0 })).toBeFalse();
  });

  it('accepts the optional rate and term only when they make sense', () => {
    expect(isDebtValid({ ...debt, annualRatePercent: 48, remainingMonths: 24 })).toBeTrue();
    expect(isDebtValid({ ...debt, annualRatePercent: -1 })).toBeFalse();
    expect(isDebtValid({ ...debt, remainingMonths: 0 })).toBeFalse();
    expect(isDebtValid({ ...debt, remainingMonths: 2.5 })).toBeFalse();
  });

  it('lets a person without debts continue', () => {
    expect(isDebtsStepComplete([])).toBeTrue();
    expect(isDebtsStepComplete([debt, { ...debt, id: 'empty', balance: 0 }])).toBeFalse();
  });
});
