import { Injectable, inject } from '@angular/core';
import { APP_SETTINGS_ID } from '@core/constants/app-settings.constant';
import { AppSettings } from '@core/models';
import { IndexedDbRepository } from '@core/repositories/indexed-db.repository';

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private readonly repository = inject(IndexedDbRepository);

  get(): Promise<AppSettings | undefined> {
    return this.repository.getById<AppSettings>('settings', APP_SETTINGS_ID);
  }

  save(settings: AppSettings): Promise<void> {
    return this.repository.save('settings', settings);
  }
}
