import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { ChartModule } from 'primeng/chart';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { formatMoney } from '@core/functions/currency.function';
import { ThemeService } from '@core/services/theme.service';
import { CHART_THEME, YEARLY_CHART_HEIGHT } from '../../constants/loan-analysis.constant';
import { buildYearlyChartData, buildYearlyChartLabels, buildYearlyChartOptions } from '../../functions/yearly-chart.function';
import { YearlyPaymentSummary } from '../../interfaces/yearly-payment-summary.interface';

@Component({
  selector: 'app-yearly-payments-chart',
  standalone: true,
  imports: [TranslocoDirective, ChartModule],
  templateUrl: './yearly-payments-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearlyPaymentsChartComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly themeService = inject(ThemeService);
  private readonly theme = computed(() => CHART_THEME[this.themeService.colorScheme()]);
  private readonly language = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  readonly years = input.required<readonly YearlyPaymentSummary[]>();
  readonly currency = input.required<CurrencyCode>();
  readonly height = YEARLY_CHART_HEIGHT;

  readonly data = computed(() => {
    this.language();
    const labels = buildYearlyChartLabels(this.years(), (key, params) => this.transloco.translate(key, params));
    return buildYearlyChartData(this.years(), labels, this.theme());
  });
  readonly options = computed(() => {
    const currency = this.currency();
    return buildYearlyChartOptions(this.theme(), amount => formatMoney(amount, currency));
  });
}
