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

export const PRIVACY_NOTICE_STORAGE_KEY = 'fc_privacy_notice';
export const PRIVACY_NOTICE_ACCEPTED_VALUE = 'accepted';
export const PRIVACY_NOTICE_POINTS: readonly string[] = ['local', 'no_server', 'control', 'device'];

export const DIALOG_STYLE = { width: '32rem' };
export const DIALOG_BREAKPOINTS = { '640px': '92vw' };

export const CLEAR_DATA_TRANSLATION_SCOPE = 'layout.clear_data';
export const CLEAR_DATA_ACCEPT_BUTTON = { severity: 'danger' };
export const CLEAR_DATA_REJECT_BUTTON = { severity: 'secondary', outlined: true };
