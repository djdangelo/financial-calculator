import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import { ExchangeRisk } from '../../interfaces/exchange-risk.interface';

@Component({
  selector: 'app-exchange-risk-alert',
  standalone: true,
  imports: [TranslocoDirective, MoneyPipe, PercentValuePipe],
  templateUrl: './exchange-risk-alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeRiskAlertComponent {
  readonly risk = input.required<ExchangeRisk>();
  readonly loanCurrency = input.required<CurrencyCode>();
}
