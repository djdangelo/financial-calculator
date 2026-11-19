import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { removeRecord, sortByCreation, upsertRecord } from '@core/functions/record.function';
import { SaveFeedbackService } from '@core/services/save-feedback.service';
import { UserDataService } from '@core/services/user-data.service';
import { FinancialProfileFacade } from '@features/financial-profile/facades';
import { summarizeLoanCost } from '@features/loan-analysis/functions/loan-cost.function';
import { WizardStepKey } from '@shared/@types/wizard-step-key.type';
import { MAX_LOAN_OFFERS } from '../constants/loan-offers.constant';
import { toggleConsolidatedDebt } from '../functions/consolidated-debts.function';
import { createLoanOffer, restoreLoanOffer } from '../functions/offer-factory.function';
import { findNeighborOfferId } from '../functions/offer-list.function';
import { isLoanOfferValid } from '../functions/offer-validation.function';
import { LoanOffer } from '../models';
import { LoanOffersService } from '../services';

@Injectable({ providedIn: 'root' })
export class LoanOffersFacade {
  private readonly service = inject(LoanOffersService);
  private readonly profile = inject(FinancialProfileFacade);
  private readonly settings = inject(AppSettingsFacade);
  private readonly saveFeedback = inject(SaveFeedbackService);
  private readonly activeOfferId = signal<string | null>(null);
  private loading?: Promise<void>;

  readonly offers = signal<LoanOffer[]>([]);

  readonly offer = computed(() => this.offers().find(offer => offer.id === this.activeOfferId()) ?? null);
  readonly completeOffers = computed(() => this.offers().filter(isLoanOfferValid));
  readonly canAddOffer = computed(() => this.offers().length < MAX_LOAN_OFFERS);
  readonly canRemoveOffer = computed(() => this.offers().length > 1);

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
    this.loading ??= this.readStoredOffers();
    return this.loading;
  }

  saveOffer(offer: LoanOffer): void {
    this.offers.update(offers => upsertRecord(offers, offer));
    this.saveFeedback.track(this.service.save(offer));
  }

  selectOffer(id: string): void {
    this.activeOfferId.set(id);
  }

  addOffer(): void {
    if (!this.canAddOffer()) {
      return;
    }
    const offer = createLoanOffer(this.offer()?.currency ?? this.settings.summaryCurrency());
    this.offers.update(offers => [...offers, offer]);
    this.activeOfferId.set(offer.id);
  }

  removeOffer(id: string): void {
    if (!this.canRemoveOffer()) {
      return;
    }
    if (this.activeOfferId() === id) {
      this.activeOfferId.set(findNeighborOfferId(this.offers(), id));
    }
    this.offers.update(offers => removeRecord(offers, id));
    this.saveFeedback.track(this.service.remove(id));
  }

  toggleConsolidatedDebt(debtId: string): void {
    const offer = this.offer();
    if (offer !== null) {
      this.saveOffer(toggleConsolidatedDebt(offer, debtId));
    }
  }

  private async readStoredOffers(): Promise<void> {
    const [stored] = await Promise.all([this.service.getAll(), this.profile.load()]);
    const offers = sortByCreation(stored).map(restoreLoanOffer);
    const initialOffers = offers.length > 0 ? offers : [createLoanOffer(this.settings.summaryCurrency())];
    this.offers.set(initialOffers);
    this.activeOfferId.set(initialOffers[0].id);
  }

  private reset(): void {
    this.offers.set([]);
    this.activeOfferId.set(null);
    this.loading = undefined;
  }
}
