import { CurrencyCode } from '@core/@types/currency-code.type';
import { sumInCurrency } from '@core/functions/currency.function';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Income } from '../models';

export function calculateIncomeContribution(income: Income): number {
  return income.monthlyAmount - income.monthlyCosts;
}

export function calculateNetMonthlyIncome(
  incomes: readonly Income[],
  currency: CurrencyCode,
  rates: ExchangeRates
): number {
  const contributions = incomes.map(income => ({
    amount: calculateIncomeContribution(income),
    currency: income.currency
  }));
  return sumInCurrency(contributions, currency, rates);
}
