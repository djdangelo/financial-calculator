import { CurrencyCode } from '@core/@types/currency-code.type';
import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { StoredRecord } from '@core/interfaces/stored-record.interface';

export interface AppSettings extends StoredRecord {
  summaryCurrency: CurrencyCode;
  exchangeRates: ExchangeRates;
  burdenLimits: BurdenLimits;
}
