import { CurrencyCode } from '@core/@types/currency-code.type';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';

export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode, rates: ExchangeRates): number {
  if (from === to) {
    return amount;
  }
  return amount * rates.unitsPerBase[to] / rates.unitsPerBase[from];
}
