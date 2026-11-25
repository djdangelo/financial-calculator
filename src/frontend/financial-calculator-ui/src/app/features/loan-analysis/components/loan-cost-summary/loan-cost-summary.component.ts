import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { FeeMode } from '@features/loan-offers/@types/fee-mode.type';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import { LoanCostSummary } from '../../interfaces/loan-cost-summary.interface';

@Component({
  selector: 'app-loan-cost-summary',
  standalone: true,
  imports: [TranslocoDirective, MoneyPipe, PercentValuePipe],
  templateUrl: './loan-cost-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanCostSummaryComponent {
  readonly cost = input.required<LoanCostSummary>();
  readonly currency = input.required<CurrencyCode>();
  readonly feeMode = input.required<FeeMode>();
  readonly nominalRatePercent = input.required<number>();
}
