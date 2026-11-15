import { LanguageCode } from '@core/@types/language-code.type';

export const AVAILABLE_LANGUAGES: readonly LanguageCode[] = ['es', 'en'];
export const DEFAULT_LANGUAGE: LanguageCode = 'es';
export const FALLBACK_LANGUAGE: LanguageCode = 'en';
export const LANGUAGE_STORAGE_KEY = 'fc_language';
export const TRANSLATIONS_PATH = 'assets/i18n';
export const APP_TITLE_KEY = 'app.title';
