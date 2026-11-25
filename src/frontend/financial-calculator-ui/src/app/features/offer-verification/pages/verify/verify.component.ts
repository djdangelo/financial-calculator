import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { formatIsoDate, toIsoDate } from '@core/functions/date.function';
import { LanguageService } from '@core/services/language.service';
import { PdfExportService } from '@core/services/pdf-export.service';
import { AmortizationTableComponent } from '@features/loan-analysis/components/amortization-table/amortization-table.component';
import { LoanCostSummaryComponent } from '@features/loan-analysis/components/loan-cost-summary/loan-cost-summary.component';
import { YearlyPaymentsChartComponent } from '@features/loan-analysis/components/yearly-payments-chart/yearly-payments-chart.component';
import { OfferFormComponent } from '@features/loan-offers/components/offer-form/offer-form.component';
import { LoanOffer } from '@features/loan-offers/models';
import { PdfExportButtonComponent } from '@shared/components/pdf-export-button/pdf-export-button.component';
import { QuoteCheckCardComponent } from '../../components/quote-check-card/quote-check-card.component';
import { VerificationExtrasFormComponent } from '../../components/verification-extras-form/verification-extras-form.component';
import { OfferVerificationFacade } from '../../facades';
import { applyLoanOffer, toLoanOffer } from '../../functions/verification-factory.function';
import { buildVerificationReport } from '../../functions/verification-report.function';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    TranslocoDirective,
    AmortizationTableComponent,
    LoanCostSummaryComponent,
    YearlyPaymentsChartComponent,
    OfferFormComponent,
    PdfExportButtonComponent,
    QuoteCheckCardComponent,
    VerificationExtrasFormComponent
  ],
  templateUrl: './verify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {
  private readonly language = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);
  private readonly pdf = inject(PdfExportService);

  readonly facade = inject(OfferVerificationFacade);

  readonly offer = computed(() => {
    const verification = this.facade.verification();
    return verification === null ? null : toLoanOffer(verification);
  });
  readonly showErrors = computed(() => (this.facade.verification()?.amount ?? 0) > 0);
  readonly formattedDueDates = computed(() => {
    const language = this.language.current();
    return (this.facade.summary()?.dueDates ?? []).map(date => formatIsoDate(date, language));
  });
  readonly lastPaymentDate = computed(() => this.formattedDueDates().at(-1) ?? '');

  ngOnInit(): void {
    this.facade.load();
  }

  updateOffer(offer: LoanOffer): void {
    const verification = this.facade.verification();
    if (verification !== null) {
      this.facade.save(applyLoanOffer(verification, offer));
    }
  }

  exportPdf(): void {
    const verification = this.facade.verification();
    const summary = this.facade.summary();
    if (verification === null || summary === null) {
      return;
    }
    const today = new Date();
    const report = buildVerificationReport(
      {
        verification,
        summary,
        formattedDueDates: this.formattedDueDates(),
        generatedOn: formatIsoDate(toIsoDate(today), this.language.current()),
        isoDate: toIsoDate(today)
      },
      (key, params) => this.transloco.translate(key, params)
    );
    this.pdf.export(report);
  }
}
