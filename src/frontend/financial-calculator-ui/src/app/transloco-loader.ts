import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { TRANSLATIONS_PATH } from '@core/constants/language.constant';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`${TRANSLATIONS_PATH}/${lang}.json`);
  }
}
