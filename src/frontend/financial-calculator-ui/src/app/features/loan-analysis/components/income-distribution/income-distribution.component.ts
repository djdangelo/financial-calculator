import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import {
  INCOME_SLICE_BLOCK_CLASS,
  INCOME_SLICE_SWATCH_CLASS,
  MIN_LABELED_SLICE_PERCENT
} from '../../constants/loan-analysis.constant';
import { IncomeSliceView } from '../../interfaces/income-slice-view.interface';
import { IncomeSlice } from '../../interfaces/income-slice.interface';

@Component({
  selector: 'app-income-distribution',
  standalone: true,
  imports: [TranslocoDirective, MoneyPipe, PercentValuePipe],
  templateUrl: './income-distribution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeDistributionComponent {
  readonly slices = input.required<readonly IncomeSlice[]>();
  readonly currency = input.required<CurrencyCode>();
  readonly available = input.required<number>();

  readonly views = computed<IncomeSliceView[]>(() =>
    this.slices().map(slice => ({
      ...slice,
      blockClass: INCOME_SLICE_BLOCK_CLASS[slice.key],
      swatchClass: INCOME_SLICE_SWATCH_CLASS[slice.key],
      showsLabel: slice.sharePercent >= MIN_LABELED_SLICE_PERCENT
    }))
  );
  readonly isOverIncome = computed(() => this.available() < 0);
}
