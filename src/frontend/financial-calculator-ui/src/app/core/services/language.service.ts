import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { LanguageCode } from '@core/@types/language-code.type';
import { APP_TITLE_KEY, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@core/constants/language.constant';
import { isLanguageCode } from '@core/functions/language.function';
import { writeLocalStorage } from '@core/functions/local-storage.function';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);

  readonly current = signal<LanguageCode>(this.activeLanguage());

  constructor() {
    this.document.documentElement.lang = this.current();

    this.transloco.selectTranslate<string>(APP_TITLE_KEY)
      .pipe(takeUntilDestroyed())
      .subscribe(title => this.title.setTitle(title));
  }

  setLanguage(language: LanguageCode): void {
    this.transloco.setActiveLang(language);
    this.current.set(language);
    this.document.documentElement.lang = language;
    writeLocalStorage(LANGUAGE_STORAGE_KEY, language);
  }

  private activeLanguage(): LanguageCode {
    const activeLanguage = this.transloco.getActiveLang();
    return isLanguageCode(activeLanguage) ? activeLanguage : DEFAULT_LANGUAGE;
  }
}
