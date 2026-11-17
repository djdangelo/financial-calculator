import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { IndexedDbRepository } from '@core/repositories/indexed-db.repository';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private readonly repository = inject(IndexedDbRepository);
  private readonly clearedSubject = new Subject<void>();

  readonly cleared$ = this.clearedSubject.asObservable();

  async clearAll(): Promise<void> {
    await this.repository.clearAll();
    this.clearedSubject.next();
  }
}
