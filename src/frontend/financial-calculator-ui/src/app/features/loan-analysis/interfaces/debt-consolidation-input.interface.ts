import { CurrencyCode } from '@core/@types/currency-code.type';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Debt } from '@features/financial-profile/models';
import { Verdict } from '../@types/verdict.type';
import { LoanCostSummary } from './loan-cost-summary.interface';

export interface DebtConsolidationInput {
  debts: readonly Debt[];
  currency: CurrencyCode;
  rates: ExchangeRates;
  cost: LoanCostSummary;
  verdict: Verdict;
}
