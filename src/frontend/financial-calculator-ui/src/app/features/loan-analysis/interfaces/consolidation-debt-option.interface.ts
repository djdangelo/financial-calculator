import { Debt } from '@features/financial-profile/models';

export interface ConsolidationDebtOption {
  debt: Debt;
  icon: string;
  selected: boolean;
  rowClass: string;
}
