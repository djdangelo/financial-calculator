import { CurrencyCode } from '@core/@types/currency-code.type';

export interface Money {
  amount: number;
  currency: CurrencyCode;
}
