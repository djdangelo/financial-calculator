import { CurrencyCode } from '@core/@types/currency-code.type';

export interface ExchangeRisk {
  incomeCurrency: CurrencyCode;
  foreignIncomePercent: number;
  paymentInIncomeCurrency: number;
  stressedPayment: number;
  stressPercent: number;
}
