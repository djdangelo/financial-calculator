import { AmortizationRow } from './amortization-row.interface';

export interface LoanCostSummary {
  disbursementFee: number;
  financedPrincipal: number;
  netDisbursement: number;
  levelPayment: number;
  monthlyInsurance: number;
  monthlyPayment: number;
  totalInterest: number;
  totalInsurance: number;
  totalPaid: number;
  totalCost: number;
  effectiveAnnualCostPercent: number;
  schedule: AmortizationRow[];
}
