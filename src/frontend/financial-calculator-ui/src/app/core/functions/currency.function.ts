import { CurrencyCode } from '@core/@types/currency-code.type';
import { CURRENCIES, CURRENCY_CODES, NUMBER_LOCALE } from '@core/constants/currency.constant';
import { EXCHANGE_RATE_DECIMALS } from '@core/constants/finance.constant';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Money } from '@core/interfaces/money.interface';
import { roundMoney, sumAmounts } from './finance.function';

export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode, rates: ExchangeRates): number {
  if (from === to) {
    return amount;
  }
  return amount * rates.unitsPerBase[to] / rates.unitsPerBase[from];
}

export function sumInCurrency(amounts: readonly Money[], currency: CurrencyCode, rates: ExchangeRates): number {
  const converted = amounts.map(money => convertAmount(money.amount, money.currency, currency, rates));
  return roundMoney(sumAmounts(converted));
}

export function areSameExchangeRates(first: ExchangeRates, second: ExchangeRates): boolean {
  return first.date === second.date
    && CURRENCY_CODES.every(currency => first.unitsPerBase[currency] === second.unitsPerBase[currency]);
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const { decimals } = CURRENCIES[currency];
  return formatWithSymbol(amount, currency, decimals, decimals);
}

export function formatExchangeRate(rate: number, currency: CurrencyCode): string {
  return formatWithSymbol(rate, currency, CURRENCIES[currency].decimals, EXCHANGE_RATE_DECIMALS);
}

function formatWithSymbol(amount: number, currency: CurrencyCode, minDecimals: number, maxDecimals: number): string {
  const digits = new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals
  }).format(Math.abs(amount));
  return `${amount < 0 ? '-' : ''}${CURRENCIES[currency].symbol} ${digits}`;
}
