import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { sortByCreation } from '@core/functions/record.function';
import { SaveFeedbackService } from '@core/services/save-feedback.service';
import { UserDataService } from '@core/services/user-data.service';
import { FinancialProfileFacade } from '@features/financial-profile/facades';
import { summarizeLoanCost } from '@features/loan-analysis/functions/loan-cost.function';
import { WizardStepKey } from '@shared/@types/wizard-step-key.type';
import { createLoanOffer } from '../functions/offer-factory.function';
import { isLoanOfferValid } from '../functions/offer-validation.function';
import { LoanOffer } from '../models';
import { LoanOffersService } from '../services';

@Injectable({ providedIn: 'root' })
export class LoanOffersFacade {
  private readonly service = inject(LoanOffersService);
  private readonly profile = inject(FinancialProfileFacade);
  private readonly settings = inject(AppSettingsFacade);
  private readonly saveFeedback = inject(SaveFeedbackService);
  private loading?: Promise<void>;

  readonly offer = signal<LoanOffer | null>(null);

  readonly isOfferComplete = computed(() => {
    const offer = this.offer();
    return offer !== null && isLoanOfferValid(offer);
  });
  readonly costSummary = computed(() => {
    const offer = this.offer();
    return offer !== null && this.isOfferComplete() ? summarizeLoanCost(offer) : null;
  });
  readonly completedSteps = computed<WizardStepKey[]>(() => [
    ...this.profile.completedSteps(),
    ...(this.isOfferComplete() ? ['offer' as const] : [])
  ]);

  constructor() {
    inject(UserDataService).cleared$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.reset());
  }

  load(): Promise<void> {
    this.loading ??= this.readStoredOffer();
    return this.loading;
  }

  saveOffer(offer: LoanOffer): void {
    this.offer.set(offer);
    this.saveFeedback.track(this.service.save(offer));
  }

  private async readStoredOffer(): Promise<void> {
    const [offers] = await Promise.all([this.service.getAll(), this.profile.load()]);
    const [firstOffer] = sortByCreation(offers);
    this.offer.set(firstOffer ?? createLoanOffer(this.settings.summaryCurrency()));
  }

  private reset(): void {
    this.offer.set(null);
    this.loading = undefined;
  }
}
