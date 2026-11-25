import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { DEFAULT_CURRENCY } from '@core/constants/currency.constant';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { formatExchangeRate } from '@core/functions/currency.function';
import { formatIsoDate, toIsoDate } from '@core/functions/date.function';
import { LanguageService } from '@core/services/language.service';
import { PdfExportService } from '@core/services/pdf-export.service';
import { DEFAULT_FEE_MODE } from '@features/loan-offers/constants/loan-offers.constant';
import { LoanOffersFacade } from '@features/loan-offers/facades';
import { PdfExportButtonComponent } from '@shared/components/pdf-export-button/pdf-export-button.component';
import { WizardStepFrameComponent } from '@shared/components/wizard-step-frame/wizard-step-frame.component';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { AmortizationTableComponent } from '../../components/amortization-table/amortization-table.component';
import { BurdenIndicatorComponent } from '../../components/burden-indicator/burden-indicator.component';
import { BurdenLimitsComponent } from '../../components/burden-limits/burden-limits.component';
import { ExchangeRiskAlertComponent } from '../../components/exchange-risk-alert/exchange-risk-alert.component';
import { DebtConsolidationComponent } from '../../components/debt-consolidation/debt-consolidation.component';
import { LoanCostSummaryComponent } from '../../components/loan-cost-summary/loan-cost-summary.component';
import { IncomeDistributionComponent } from '../../components/income-distribution/income-distribution.component';
import { MaxLoanCardComponent } from '../../components/max-loan-card/max-loan-card.component';
import { OfferComparisonComponent } from '../../components/offer-comparison/offer-comparison.component';
import { ResultHelpComponent } from '../../components/result-help/result-help.component';
import { VerdictCardComponent } from '../../components/verdict-card/verdict-card.component';
import { YearlyPaymentsChartComponent } from '../../components/yearly-payments-chart/yearly-payments-chart.component';
import { AVAILABLE_AFTER_LOAN_CLASS } from '../../constants/loan-analysis.constant';
import { LoanAnalysisFacade } from '../../facades';
import { buildResultReport } from '../../functions/result-report.function';

@Component({
  selector: 'app-result-step',
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    PdfExportButtonComponent,
    WizardStepFrameComponent,
    MoneyPipe,
    AmortizationTableComponent,
    BurdenIndicatorComponent,
    BurdenLimitsComponent,
    DebtConsolidationComponent,
    ExchangeRiskAlertComponent,
    IncomeDistributionComponent,
    LoanCostSummaryComponent,
    MaxLoanCardComponent,
    OfferComparisonComponent,
    ResultHelpComponent,
    VerdictCardComponent,
    YearlyPaymentsChartComponent
  ],
  templateUrl: './result-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultStepComponent {
  private readonly settings = inject(AppSettingsFacade);
  private readonly offers = inject(LoanOffersFacade);

  private readonly language = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);
  private readonly pdf = inject(PdfExportService);

  readonly facade = inject(LoanAnalysisFacade);
  readonly generatedOn = computed(() => formatIsoDate(toIsoDate(new Date()), this.language.current()));

  readonly availableClass = computed(() =>
    AVAILABLE_AFTER_LOAN_CLASS[(this.facade.analysis()?.availableAfterLoan ?? 0) < 0 ? 'over' : 'within']
  );
  readonly feeMode = computed(() => this.offers.offer()?.feeMode ?? DEFAULT_FEE_MODE);
  readonly requestedAmount = computed(() => this.offers.offer()?.amount ?? 0);
  readonly nominalRate = computed(() => this.offers.offer()?.annualRatePercent ?? 0);
  readonly activeOfferId = computed(() => this.offers.offer()?.id ?? null);
  readonly activeOfferName = computed(() => this.offers.offer()?.bankName.trim() ?? '');
  readonly activePosition = computed(() =>
    this.offers.offers().findIndex(offer => offer.id === this.activeOfferId()) + 1
  );
  readonly exchangeRate = computed(() =>
    formatExchangeRate(this.settings.exchangeRates().unitsPerBase[DEFAULT_CURRENCY], DEFAULT_CURRENCY)
  );

  exportPdf(): void {
    const analysis = this.facade.analysis();
    const offer = this.offers.offer();
    if (analysis === null || offer === null) {
      return;
    }
    const report = buildResultReport(
      {
        analysis,
        offer,
        yearlyPayments: this.facade.yearlyPayments(),
        isConsolidating: this.facade.isConsolidating(),
        generatedOn: this.generatedOn(),
        isoDate: toIsoDate(new Date())
      },
      (key, params) => this.transloco.translate(key, params)
    );
    this.pdf.export(report);
  }
}
