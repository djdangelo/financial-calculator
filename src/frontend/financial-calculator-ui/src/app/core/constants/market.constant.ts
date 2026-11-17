import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { BASE_CURRENCY } from './currency.constant';

export const DEFAULT_BURDEN_LIMITS: BurdenLimits = {
  totalBurdenPercent: 80,
  debtBurdenPercent: 40
};

export const SUGGESTED_EXCHANGE_RATES: ExchangeRates = {
  base: BASE_CURRENCY,
  unitsPerBase: { USD: 1, HNL: 27.0173 },
  date: '2026-09-11'
};

export const EXCHANGE_RATE_SOURCE_URL = 'https://www.bch.hn/estadisticas-y-publicaciones-economicas/tipo-de-cambio-nominal';
export const MIN_BURDEN_LIMIT_PERCENT = 1;
export const MAX_BURDEN_LIMIT_PERCENT = 100;
