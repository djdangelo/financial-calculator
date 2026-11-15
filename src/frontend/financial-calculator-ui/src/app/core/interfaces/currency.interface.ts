import { CurrencyCode } from '@core/@types/currency-code.type';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  decimals: number;
}
