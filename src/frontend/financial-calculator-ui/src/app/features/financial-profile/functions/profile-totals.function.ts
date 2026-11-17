import { CurrencyCode } from '@core/@types/currency-code.type';
import { sumInCurrency } from '@core/functions/currency.function';
import { roundMoney } from '@core/functions/finance.function';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Debt, Expense } from '../models';

export function calculateMonthlyExpenses(
  expenses: readonly Expense[],
  currency: CurrencyCode,
  rates: ExchangeRates
): number {
  const amounts = expenses.map(expense => ({ amount: expense.monthlyAmount, currency: expense.currency }));
  return sumInCurrency(amounts, currency, rates);
}

export function calculateMonthlyDebtPayments(
  debts: readonly Debt[],
  currency: CurrencyCode,
  rates: ExchangeRates
): number {
  const amounts = debts.map(debt => ({ amount: debt.monthlyPayment, currency: debt.currency }));
  return sumInCurrency(amounts, currency, rates);
}

export function calculateDebtBalance(debts: readonly Debt[], currency: CurrencyCode, rates: ExchangeRates): number {
  const amounts = debts.map(debt => ({ amount: debt.balance, currency: debt.currency }));
  return sumInCurrency(amounts, currency, rates);
}

export function calculateAvailableIncome(netIncome: number, expenses: number, debtPayments: number): number {
  return roundMoney(netIncome - expenses - debtPayments);
}

export function usesAnotherCurrency(currencies: readonly CurrencyCode[], currency: CurrencyCode): boolean {
  return currencies.some(current => current !== currency);
}
