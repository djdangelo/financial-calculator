import { Injectable, inject } from '@angular/core';
import { IndexedDbRepository } from '@core/repositories/indexed-db.repository';
import { LoanOffer } from '../models';

@Injectable({ providedIn: 'root' })
export class LoanOffersService {
  private readonly repository = inject(IndexedDbRepository);

  getAll(): Promise<LoanOffer[]> {
    return this.repository.getAll<LoanOffer>('loan-offers');
  }

  save(offer: LoanOffer): Promise<void> {
    return this.repository.save('loan-offers', offer);
  }

  remove(id: string): Promise<void> {
    return this.repository.remove('loan-offers', id);
  }
}
