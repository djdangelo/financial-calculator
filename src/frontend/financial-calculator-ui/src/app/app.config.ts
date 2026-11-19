import { APP_INITIALIZER, ApplicationConfig, inject, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTransloco } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { APP_THEME_PRESET } from '@core/config/theme.config';
import { AVAILABLE_LANGUAGES, FALLBACK_LANGUAGE } from '@core/constants/language.constant';
import { SERVICE_WORKER_REGISTRATION, SERVICE_WORKER_SCRIPT } from '@core/constants/pwa.constant';
import { THEME_OPTIONS } from '@core/constants/theme.constant';
import { resolveInitialLanguage } from '@core/functions/language.function';
import { LanguageService } from '@core/services/language.service';
import { PwaService } from '@core/services/pwa.service';
import { ThemeService } from '@core/services/theme.service';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: APP_THEME_PRESET,
        options: THEME_OPTIONS
      }
    }),
    provideTransloco({
      config: {
        availableLangs: [...AVAILABLE_LANGUAGES],
        defaultLang: resolveInitialLanguage(),
        fallbackLang: FALLBACK_LANGUAGE,
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: TranslocoHttpLoader
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        inject(ThemeService);
        inject(LanguageService);
        inject(PwaService);
        return () => undefined;
      }
    },
    MessageService,
    provideServiceWorker(SERVICE_WORKER_SCRIPT, {
      enabled: !isDevMode(),
      registrationStrategy: SERVICE_WORKER_REGISTRATION
    })
  ]
};
