import { LanguageCode } from '@core/@types/language-code.type';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@core/constants/language.constant';
import { readLocalStorage } from './local-storage.function';

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return AVAILABLE_LANGUAGES.includes(value as LanguageCode);
}

export function resolveInitialLanguage(): LanguageCode {
  const storedLanguage = readLocalStorage(LANGUAGE_STORAGE_KEY);
  if (isLanguageCode(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = navigator.language.split('-')[0];
  return isLanguageCode(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE;
}
