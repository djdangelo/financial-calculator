import { CurrencyCode } from '@core/@types/currency-code.type';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Income } from '@features/financial-profile/models';

export interface ExchangeRiskInput {
  incomes: readonly Income[];
  loanCurrency: CurrencyCode;
  monthlyPayment: number;
  rates: ExchangeRates;
  stressPercent: number;
}
