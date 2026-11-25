import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import { QUOTE_STATUS_CARD_CLASS, QUOTE_STATUS_ICON_CLASS } from '../../constants/offer-verification.constant';
import { QuoteCheck } from '../../interfaces/quote-check.interface';

@Component({
  selector: 'app-quote-check-card',
  standalone: true,
  imports: [TranslocoDirective, MoneyPipe, PercentValuePipe],
  templateUrl: './quote-check-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteCheckCardComponent {
  readonly quote = input.required<QuoteCheck>();
  readonly currency = input.required<CurrencyCode>();

  readonly cardClass = computed(() => QUOTE_STATUS_CARD_CLASS[this.quote().status]);
  readonly iconClass = computed(() => QUOTE_STATUS_ICON_CLASS[this.quote().status]);
  readonly difference = computed(() => Math.abs(this.quote().difference));
  readonly differenceOverTerm = computed(() => Math.abs(this.quote().differenceOverTerm));
}
