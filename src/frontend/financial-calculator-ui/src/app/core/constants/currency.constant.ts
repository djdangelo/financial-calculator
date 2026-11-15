import { CurrencyCode } from '@core/@types/currency-code.type';
import { Currency } from '@core/interfaces/currency.interface';
import { MONEY_DECIMALS } from './finance.constant';

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  HNL: { code: 'HNL', symbol: 'L', decimals: MONEY_DECIMALS },
  USD: { code: 'USD', symbol: '$', decimals: MONEY_DECIMALS }
};

export const CURRENCY_CODES: readonly CurrencyCode[] = ['HNL', 'USD'];
export const DEFAULT_CURRENCY: CurrencyCode = 'HNL';
export const BASE_CURRENCY: CurrencyCode = 'USD';
