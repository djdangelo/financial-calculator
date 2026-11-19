import { ColorScheme } from '@core/@types/color-scheme.type';
import { OfferTabState } from '@features/loan-offers/@types/offer-tab-state.type';
import { BurdenStatus } from '../@types/burden-status.type';
import { DebtOptionState } from '../@types/debt-option-state.type';
import { IncomeSliceKey } from '../@types/income-slice-key.type';
import { Verdict } from '../@types/verdict.type';
import { ChartTheme } from '../interfaces/chart-theme.interface';
import { HelpTerm } from '../interfaces/help-term.interface';

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

export const CONSOLIDATION_REQUIRED_VERDICT: Verdict = 'can-take';

export const CONSOLIDATION_RESULT_CLASS: Record<BurdenStatus, string> = {
  within: 'flex items-start gap-3 rounded-xl border p-4 border-primary-200 bg-primary-50 dark:border-primary-900 dark:bg-primary-950',
  over: 'flex items-start gap-3 rounded-xl border p-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
};

export const CONSOLIDATION_RESULT_ICON: Record<BurdenStatus, string> = {
  within: 'pi pi-check-circle mt-0.5 text-lg text-primary-700 dark:text-primary-300',
  over: 'pi pi-exclamation-triangle mt-0.5 text-lg text-amber-700 dark:text-amber-300'
};

export const CONSOLIDATION_DEBT_ROW_CLASS: Record<DebtOptionState, string> = {
  selected: 'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors border-primary-300 bg-primary-50 dark:border-primary-800 dark:bg-primary-950',
  idle: 'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors border-surface-200 hover:bg-surface-50 dark:border-surface-800 dark:hover:bg-surface-950'
};

export const MIN_OFFERS_TO_COMPARE = 2;

export const INCOME_SLICE_SWATCH_CLASS: Record<IncomeSliceKey, string> = {
  expenses: 'bg-[#2a78d6] dark:bg-[#3987e5]',
  'current-debts': 'bg-[#eb6834] dark:bg-[#d95926]',
  'new-payment': 'bg-[#1baf7a] dark:bg-[#199e70]',
  available: 'bg-[#eda100] dark:bg-[#c98500]'
};

export const INCOME_SLICE_BLOCK_CLASS: Record<IncomeSliceKey, string> = {
  expenses: 'flex h-7 min-w-0 items-center overflow-hidden rounded px-1.5 text-xs font-semibold text-white bg-[#2a78d6] dark:bg-[#3987e5]',
  'current-debts': 'flex h-7 min-w-0 items-center overflow-hidden rounded px-1.5 text-xs font-semibold text-white bg-[#eb6834] dark:bg-[#d95926]',
  'new-payment': 'flex h-7 min-w-0 items-center overflow-hidden rounded px-1.5 text-xs font-semibold text-[#0b0b0b] bg-[#1baf7a] dark:bg-[#199e70]',
  available: 'flex h-7 min-w-0 items-center overflow-hidden rounded px-1.5 text-xs font-semibold text-[#0b0b0b] bg-[#eda100] dark:bg-[#c98500]'
};

export const MIN_LABELED_SLICE_PERCENT = 9;

export const CHART_THEME: Record<ColorScheme, ChartTheme> = {
  light: {
    principal: '#2a78d6',
    interest: '#eb6834',
    insurance: '#1baf7a',
    surface: '#ffffff',
    text: '#475569',
    grid: '#e2e8f0'
  },
  dark: {
    principal: '#3987e5',
    interest: '#d95926',
    insurance: '#199e70',
    surface: '#0f172a',
    text: '#cbd5e1',
    grid: '#1e293b'
  }
};

export const CHART_BAR_MAX_THICKNESS = 24;
export const CHART_BAR_RADIUS = 4;
export const CHART_SEGMENT_GAP = 2;
export const CHART_FONT_SIZE = 12;

export const COMPARISON_COLUMN_CLASS: Record<OfferTabState, string> = {
  active: 'min-w-40 px-3 py-2 text-right align-top bg-primary-50 dark:bg-primary-950',
  idle: 'min-w-40 px-3 py-2 text-right align-top'
};

export const YEARLY_CHART_HEIGHT = '18rem';

export const RESULT_HELP_TERMS: readonly HelpTerm[] = [
  { key: 'level-payment', icon: 'pi pi-calendar' },
  { key: 'effective-cost', icon: 'pi pi-percentage' },
  { key: 'total-limit', icon: 'pi pi-wallet' },
  { key: 'debt-limit', icon: 'pi pi-credit-card' },
  { key: 'consolidation', icon: 'pi pi-sitemap' },
  { key: 'exchange-rate', icon: 'pi pi-sync' }
];
