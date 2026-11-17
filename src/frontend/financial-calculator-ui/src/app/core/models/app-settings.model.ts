import { CurrencyCode } from '@core/@types/currency-code.type';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { StoredRecord } from '@core/interfaces/stored-record.interface';

export interface AppSettings extends StoredRecord {
  summaryCurrency: CurrencyCode;
  exchangeRates: ExchangeRates;
}
