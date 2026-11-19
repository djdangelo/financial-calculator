import { IncomeSliceKey } from '../@types/income-slice-key.type';

export interface IncomeSlice {
  key: IncomeSliceKey;
  amount: number;
  sharePercent: number;
}
