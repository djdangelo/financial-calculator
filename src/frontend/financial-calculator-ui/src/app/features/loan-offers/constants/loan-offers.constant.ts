import { FeeMode } from '../@types/fee-mode.type';
import { OfferTabState } from '../@types/offer-tab-state.type';

export const DEFAULT_FEE_MODE: FeeMode = 'deducted';
export const FEE_MODES: FeeMode[] = ['deducted', 'financed'];
export const BANK_NAME_MAX_LENGTH = 60;
export const MAX_LOAN_OFFERS = 4;

export const OFFER_TAB_CLASS: Record<OfferTabState, string> = {
  active: 'flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors border-primary-300 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-100',
  idle: 'flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors border-surface-200 bg-surface-0 text-surface-700 hover:bg-surface-50 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:bg-surface-800'
};
