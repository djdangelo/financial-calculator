import { IncomeSlice } from './income-slice.interface';

export interface IncomeSliceView extends IncomeSlice {
  blockClass: string;
  swatchClass: string;
  showsLabel: boolean;
}
