import { ColorScheme } from '@core/@types/color-scheme.type';

export const THEME_TOGGLE_ICON: Record<ColorScheme, string> = {
  light: 'pi pi-moon',
  dark: 'pi pi-sun'
};

export const THEME_TOGGLE_LABEL_KEY: Record<ColorScheme, string> = {
  light: 'switch_to_dark',
  dark: 'switch_to_light'
};

export const LANGUAGE_BUTTON_CLASS = {
  active: 'rounded-md px-2.5 py-1 text-xs font-bold uppercase transition-colors bg-primary text-primary-contrast',
  inactive: 'rounded-md px-2.5 py-1 text-xs font-bold uppercase transition-colors text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-0'
};
