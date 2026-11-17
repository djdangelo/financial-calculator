import { BurdenStatus } from '../@types/burden-status.type';
import { Verdict } from '../@types/verdict.type';

export const INTERNAL_RATE_MAX_MONTHLY = 1;
export const INTERNAL_RATE_TOLERANCE = 1e-10;
export const INTERNAL_RATE_MAX_ITERATIONS = 200;

export const AMORTIZATION_ROWS_PER_PAGE = 12;
export const AMORTIZATION_ROWS_PER_PAGE_OPTIONS = [12, 24, 60];
export const AMORTIZATION_TABLE_STYLE = { 'min-width': '36rem' };
export const MAX_BAR_PERCENT = 100;

export const VERDICT_ICON: Record<Verdict, string> = {
  'can-take': 'pi pi-check-circle',
  caution: 'pi pi-exclamation-triangle',
  'not-recommended': 'pi pi-times-circle'
};

export const VERDICT_CARD_CLASS: Record<Verdict, string> = {
  'can-take': 'flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-start sm:p-6 border-primary-200 bg-primary-50 dark:border-primary-900 dark:bg-primary-950',
  caution: 'flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-start sm:p-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950',
  'not-recommended': 'flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-start sm:p-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
};

export const VERDICT_ICON_CLASS: Record<Verdict, string> = {
  'can-take': 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  caution: 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  'not-recommended': 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
};

export const BURDEN_BAR_CLASS: Record<BurdenStatus, string> = {
  within: 'h-full rounded-full transition-all duration-500 bg-primary-500 dark:bg-primary-400',
  over: 'h-full rounded-full transition-all duration-500 bg-red-500 dark:bg-red-400'
};

export const BURDEN_VALUE_CLASS: Record<BurdenStatus, string> = {
  within: 'shrink-0 whitespace-nowrap text-xl font-extrabold tabular-nums text-surface-900 dark:text-surface-0',
  over: 'shrink-0 whitespace-nowrap text-xl font-extrabold tabular-nums text-red-600 dark:text-red-400'
};

export const AVAILABLE_AFTER_LOAN_CLASS: Record<BurdenStatus, string> = {
  within: 'text-lg font-extrabold tabular-nums text-surface-900 dark:text-surface-0',
  over: 'text-lg font-extrabold tabular-nums text-red-600 dark:text-red-400'
};
