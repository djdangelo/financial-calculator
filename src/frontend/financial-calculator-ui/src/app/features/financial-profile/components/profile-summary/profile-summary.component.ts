import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CURRENCIES, DEFAULT_CURRENCY, NUMBER_LOCALE } from '@core/constants/currency.constant';
import { EXCHANGE_RATE_DECIMALS, MIN_EXCHANGE_RATE, MONEY_DECIMALS } from '@core/constants/finance.constant';
import { EXCHANGE_RATE_SOURCE_URL, SUGGESTED_EXCHANGE_RATES } from '@core/constants/market.constant';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { formatExchangeRate } from '@core/functions/currency.function';
import { formatIsoDate } from '@core/functions/date.function';
import { LanguageService } from '@core/services/language.service';
import { CurrencyToggleComponent } from '@shared/components/currency-toggle/currency-toggle.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { AVAILABLE_INCOME_CLASS } from '../../constants/financial-profile.constant';
import { FinancialProfileFacade } from '../../facades';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoDirective,
    ButtonModule,
    InputNumberModule,
    CurrencyToggleComponent,
    FormFieldComponent,
    MoneyPipe
  ],
  templateUrl: './profile-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSummaryComponent {
  private readonly languageService = inject(LanguageService);

  readonly profile = inject(FinancialProfileFacade);
  readonly settings = inject(AppSettingsFacade);

  readonly rate = computed(() => this.settings.exchangeRates().unitsPerBase[DEFAULT_CURRENCY]);
  readonly suggestedDate = computed(() =>
    formatIsoDate(SUGGESTED_EXCHANGE_RATES.date, this.languageService.current())
  );
  readonly availableClass = computed(() =>
    AVAILABLE_INCOME_CLASS[this.profile.availableIncome() < 0 ? 'negative' : 'positive']
  );
  readonly hasDebts = computed(() => this.profile.debts().length > 0);

  readonly suggestedRate = formatExchangeRate(SUGGESTED_EXCHANGE_RATES.unitsPerBase[DEFAULT_CURRENCY], DEFAULT_CURRENCY);
  readonly ratePrefix = `${CURRENCIES[DEFAULT_CURRENCY].symbol} `;
  readonly sourceUrl = EXCHANGE_RATE_SOURCE_URL;
  readonly locale = NUMBER_LOCALE;
  readonly minRate = MIN_EXCHANGE_RATE;
  readonly minRateDecimals = MONEY_DECIMALS;
  readonly maxRateDecimals = EXCHANGE_RATE_DECIMALS;

  setRate(rate: number | null): void {
    this.settings.setExchangeRate(DEFAULT_CURRENCY, rate);
  }
}
