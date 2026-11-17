import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { DEFAULT_CURRENCY } from '@core/constants/currency.constant';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import { LoanOffersFacade } from '../../facades';

@Component({
  selector: 'app-offer-preview',
  standalone: true,
  imports: [TranslocoDirective, MoneyPipe, PercentValuePipe],
  templateUrl: './offer-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferPreviewComponent {
  private readonly facade = inject(LoanOffersFacade);
  readonly summary = this.facade.costSummary;
  readonly currency = computed(() => this.facade.offer()?.currency ?? DEFAULT_CURRENCY);
}
