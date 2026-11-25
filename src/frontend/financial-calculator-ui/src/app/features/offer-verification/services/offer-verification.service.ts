import { Injectable, inject } from '@angular/core';
import { IndexedDbRepository } from '@core/repositories/indexed-db.repository';
import { OfferVerification } from '../models';

@Injectable({ providedIn: 'root' })
export class OfferVerificationService {
  private readonly repository = inject(IndexedDbRepository);

  getById(id: string): Promise<OfferVerification | undefined> {
    return this.repository.getById<OfferVerification>('offer-verifications', id);
  }

  save(verification: OfferVerification): Promise<void> {
    return this.repository.save('offer-verifications', verification);
  }
}
