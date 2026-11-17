import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import {
  BURDEN_BAR_CLASS,
  BURDEN_VALUE_CLASS,
  MAX_BAR_PERCENT
} from '../../constants/loan-analysis.constant';
import { resolveBurdenStatus, toBarWidthPercent } from '../../functions/burden-status.function';

@Component({
  selector: 'app-burden-indicator',
  standalone: true,
  imports: [TranslocoDirective, PercentValuePipe],
  templateUrl: './burden-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BurdenIndicatorComponent {
  readonly label = input.required<string>();
  readonly description = input('');
  readonly percent = input.required<number>();
  readonly limit = input.required<number>();

  readonly status = computed(() => resolveBurdenStatus(this.percent(), this.limit()));
  readonly isOver = computed(() => this.status() === 'over');
  readonly hasIncome = computed(() => Number.isFinite(this.percent()));
  readonly barClass = computed(() => BURDEN_BAR_CLASS[this.status()]);
  readonly valueClass = computed(() => BURDEN_VALUE_CLASS[this.status()]);
  readonly barWidth = computed(() => `${toBarWidthPercent(this.percent())}%`);
  readonly limitPosition = computed(() => `${toBarWidthPercent(this.limit())}%`);
  readonly maxBar = MAX_BAR_PERCENT;
}
