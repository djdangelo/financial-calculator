import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { LoanOffer } from '@features/loan-offers/models';

export interface LoanAnalysisInput {
  offer: LoanOffer;
  netIncome: number;
  expenses: number;
  currentDebtPayments: number;
  limits: BurdenLimits;
}
