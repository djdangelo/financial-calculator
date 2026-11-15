import { ThemeMode } from '@core/@types/theme-mode.type';

export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
export const DEFAULT_THEME_MODE: ThemeMode = 'system';
export const THEME_STORAGE_KEY = 'fc_theme_mode';
export const DARK_CLASS = 'dark';
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
export const THEME_OPTIONS = { darkModeSelector: `.${DARK_CLASS}` };

export const PALETTE_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export const PRIMARY_PALETTE = 'emerald';
export const SURFACE_PALETTE = 'slate';
export const SURFACE_BASE_COLOR = '#ffffff';
