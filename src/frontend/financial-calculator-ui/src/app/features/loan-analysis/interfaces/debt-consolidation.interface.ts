import { ConsolidationIssue } from '../@types/consolidation-issue.type';

export interface DebtConsolidation {
  debtCount: number;
  coveredBalance: number;
  netDisbursement: number;
  cashLeft: number;
  replacedPayments: number;
  newPayment: number;
  monthlySavings: number;
  currentRemainingCost: number | null;
  consolidatedTotalCost: number;
  extraTotalCost: number | null;
  issues: ConsolidationIssue[];
  recommended: boolean;
}
