import { CurrencyCode } from '@core/@types/currency-code.type';

export interface ExchangeRates {
  base: CurrencyCode;
  unitsPerBase: Record<CurrencyCode, number>;
  date: string;
}
