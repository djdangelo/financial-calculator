import { CurrencyCode } from '@core/@types/currency-code.type';
import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { Verdict } from '../@types/verdict.type';
import { DebtIndicators } from './debt-indicators.interface';
import { LoanCostSummary } from './loan-cost-summary.interface';
import { MonthlyBudget } from './monthly-budget.interface';

export interface LoanAnalysis {
  currency: CurrencyCode;
  cost: LoanCostSummary;
  budget: MonthlyBudget;
  indicators: DebtIndicators;
  limits: BurdenLimits;
  verdict: Verdict;
  availableAfterLoan: number;
}
