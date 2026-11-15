import { ThemeMode } from '@core/@types/theme-mode.type';
import {
  DEFAULT_THEME_MODE,
  PALETTE_SHADES,
  SURFACE_BASE_COLOR,
  THEME_MODES,
  THEME_STORAGE_KEY
} from '@core/constants/theme.constant';
import { readLocalStorage } from './local-storage.function';

export function readStoredThemeMode(): ThemeMode {
  const storedMode = readLocalStorage(THEME_STORAGE_KEY) as ThemeMode | null;
  return storedMode && THEME_MODES.includes(storedMode) ? storedMode : DEFAULT_THEME_MODE;
}

export function paletteTokens(palette: string): Record<string, string> {
  return Object.fromEntries(PALETTE_SHADES.map(shade => [shade, `{${palette}.${shade}}`]));
}

export function surfaceTokens(palette: string): Record<string, string> {
  return { 0: SURFACE_BASE_COLOR, ...paletteTokens(palette) };
}
