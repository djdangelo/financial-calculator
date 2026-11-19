import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { DEFAULT_CURRENCY } from '@core/constants/currency.constant';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { formatExchangeRate } from '@core/functions/currency.function';
import { DEFAULT_FEE_MODE } from '@features/loan-offers/constants/loan-offers.constant';
import { LoanOffersFacade } from '@features/loan-offers/facades';
import { WizardStepFrameComponent } from '@shared/components/wizard-step-frame/wizard-step-frame.component';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import { AmortizationTableComponent } from '../../components/amortization-table/amortization-table.component';
import { BurdenIndicatorComponent } from '../../components/burden-indicator/burden-indicator.component';
import { BurdenLimitsComponent } from '../../components/burden-limits/burden-limits.component';
import { DebtConsolidationComponent } from '../../components/debt-consolidation/debt-consolidation.component';
import { VerdictCardComponent } from '../../components/verdict-card/verdict-card.component';
import { AVAILABLE_AFTER_LOAN_CLASS } from '../../constants/loan-analysis.constant';
import { LoanAnalysisFacade } from '../../facades';

@Component({
  selector: 'app-result-step',
  standalone: true,
  imports: [
    TranslocoDirective,
    WizardStepFrameComponent,
    MoneyPipe,
    PercentValuePipe,
    AmortizationTableComponent,
    BurdenIndicatorComponent,
    BurdenLimitsComponent,
    DebtConsolidationComponent,
    VerdictCardComponent
  ],
  templateUrl: './result-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultStepComponent {
  private readonly settings = inject(AppSettingsFacade);
  private readonly offers = inject(LoanOffersFacade);

  readonly facade = inject(LoanAnalysisFacade);

  readonly availableClass = computed(() =>
    AVAILABLE_AFTER_LOAN_CLASS[(this.facade.analysis()?.availableAfterLoan ?? 0) < 0 ? 'over' : 'within']
  );
  readonly feeMode = computed(() => this.offers.offer()?.feeMode ?? DEFAULT_FEE_MODE);
  readonly nominalRate = computed(() => this.offers.offer()?.annualRatePercent ?? 0);
  readonly exchangeRate = computed(() =>
    formatExchangeRate(this.settings.exchangeRates().unitsPerBase[DEFAULT_CURRENCY], DEFAULT_CURRENCY)
  );
}
