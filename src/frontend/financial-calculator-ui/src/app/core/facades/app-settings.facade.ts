import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { DEFAULT_APP_SETTINGS } from '@core/constants/app-settings.constant';
import { MIN_EXCHANGE_RATE } from '@core/constants/finance.constant';
import { SUGGESTED_EXCHANGE_RATES } from '@core/constants/market.constant';
import { areSameExchangeRates } from '@core/functions/currency.function';
import { toIsoDate } from '@core/functions/date.function';
import { AppSettings } from '@core/models';
import { AppSettingsService } from '@core/services/app-settings.service';
import { SaveFeedbackService } from '@core/services/save-feedback.service';
import { UserDataService } from '@core/services/user-data.service';

@Injectable({ providedIn: 'root' })
export class AppSettingsFacade {
  private readonly service = inject(AppSettingsService);
  private readonly saveFeedback = inject(SaveFeedbackService);
  private readonly settings = signal<AppSettings>(DEFAULT_APP_SETTINGS);
  private loading?: Promise<void>;

  readonly summaryCurrency = computed(() => this.settings().summaryCurrency);
  readonly exchangeRates = computed(() => this.settings().exchangeRates);
  readonly usesSuggestedRates = computed(() => areSameExchangeRates(this.exchangeRates(), SUGGESTED_EXCHANGE_RATES));

  constructor() {
    inject(UserDataService).cleared$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.settings.set(DEFAULT_APP_SETTINGS));
  }

  load(): Promise<void> {
    this.loading ??= this.readStoredSettings();
    return this.loading;
  }

  setSummaryCurrency(summaryCurrency: CurrencyCode): void {
    this.update({ summaryCurrency });
  }

  setExchangeRate(currency: CurrencyCode, unitsPerBase: number | null): void {
    if (unitsPerBase === null || unitsPerBase < MIN_EXCHANGE_RATE) {
      return;
    }

    const current = this.exchangeRates();
    this.update({
      exchangeRates: {
        ...current,
        unitsPerBase: { ...current.unitsPerBase, [currency]: unitsPerBase },
        date: toIsoDate(new Date())
      }
    });
  }

  useSuggestedRates(): void {
    this.update({ exchangeRates: SUGGESTED_EXCHANGE_RATES });
  }

  private update(changes: Partial<AppSettings>): void {
    const settings = { ...this.settings(), ...changes };
    this.settings.set(settings);
    this.saveFeedback.track(this.service.save(settings));
  }

  private async readStoredSettings(): Promise<void> {
    const stored = await this.service.get();
    if (stored) {
      this.settings.set({ ...DEFAULT_APP_SETTINGS, ...stored });
    }
  }
}
