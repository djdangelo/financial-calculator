import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { Verdict } from '../../@types/verdict.type';
import { VERDICT_CARD_CLASS, VERDICT_ICON, VERDICT_ICON_CLASS } from '../../constants/loan-analysis.constant';

@Component({
  selector: 'app-verdict-card',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './verdict-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerdictCardComponent {
  readonly verdict = input.required<Verdict>();
  readonly limits = input.required<BurdenLimits>();

  readonly cardClass = computed(() => VERDICT_CARD_CLASS[this.verdict()]);
  readonly iconClass = computed(() => VERDICT_ICON_CLASS[this.verdict()]);
  readonly icon = computed(() => VERDICT_ICON[this.verdict()]);
}
