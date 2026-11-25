import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { toIsoDate } from '@core/functions/date.function';
import { SaveFeedbackService } from '@core/services/save-feedback.service';
import { UserDataService } from '@core/services/user-data.service';
import { OFFER_VERIFICATION_ID } from '../constants/offer-verification.constant';
import { summarizeOfferVerification } from '../functions/offer-verification.function';
import { createOfferVerification } from '../functions/verification-factory.function';
import { isOfferVerificationValid } from '../functions/verification-validation.function';
import { OfferVerification } from '../models';
import { OfferVerificationService } from '../services';

@Injectable({ providedIn: 'root' })
export class OfferVerificationFacade {
  private readonly service = inject(OfferVerificationService);
  private readonly settings = inject(AppSettingsFacade);
  private readonly saveFeedback = inject(SaveFeedbackService);
  private loading?: Promise<void>;

  readonly verification = signal<OfferVerification | null>(null);

  readonly isComplete = computed(() => {
    const verification = this.verification();
    return verification !== null && isOfferVerificationValid(verification);
  });
  readonly summary = computed(() => {
    const verification = this.verification();
    return verification !== null && this.isComplete() ? summarizeOfferVerification(verification) : null;
  });

  constructor() {
    inject(UserDataService).cleared$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.reset());
  }

  load(): Promise<void> {
    this.loading ??= this.readStoredVerification();
    return this.loading;
  }

  save(verification: OfferVerification): void {
    this.verification.set(verification);
    this.saveFeedback.track(this.service.save(verification));
  }

  private async readStoredVerification(): Promise<void> {
    const [stored] = await Promise.all([this.service.getById(OFFER_VERIFICATION_ID), this.settings.load()]);
    this.verification.set(stored ?? createOfferVerification(this.settings.summaryCurrency(), toIsoDate(new Date())));
  }

  private reset(): void {
    this.verification.set(null);
    this.loading = undefined;
  }
}
