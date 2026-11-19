import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { roundMoney } from '@core/functions/finance.function';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { MaxLoanAmount } from '../../interfaces/max-loan-amount.interface';

@Component({
  selector: 'app-max-loan-card',
  standalone: true,
  imports: [TranslocoDirective, MoneyPipe],
  templateUrl: './max-loan-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaxLoanCardComponent {
  readonly maxLoan = input.required<MaxLoanAmount>();
  readonly requestedAmount = input.required<number>();
  readonly currency = input.required<CurrencyCode>();

  readonly hasRoom = computed(() => this.maxLoan().maxAmount > 0);
  readonly excess = computed(() => roundMoney(this.requestedAmount() - this.maxLoan().maxAmount));
}
