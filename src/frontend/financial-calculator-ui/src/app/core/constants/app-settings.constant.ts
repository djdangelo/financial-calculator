import { AppSettings } from '@core/models';
import { DEFAULT_CURRENCY } from './currency.constant';
import { DEFAULT_BURDEN_LIMITS, SUGGESTED_EXCHANGE_RATES } from './market.constant';

export const APP_SETTINGS_ID = 'app-settings';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: APP_SETTINGS_ID,
  summaryCurrency: DEFAULT_CURRENCY,
  exchangeRates: SUGGESTED_EXCHANGE_RATES,
  burdenLimits: DEFAULT_BURDEN_LIMITS
};
