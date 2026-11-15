import { CurrencyCode } from '@core/@types/currency-code.type';
import { convertAmount } from '@core/functions/currency.function';
import { roundMoney, sumAmounts } from '@core/functions/finance.function';
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
  const contributions = incomes.map(income =>
    convertAmount(calculateIncomeContribution(income), income.currency, currency, rates)
  );
  return roundMoney(sumAmounts(contributions));
}
