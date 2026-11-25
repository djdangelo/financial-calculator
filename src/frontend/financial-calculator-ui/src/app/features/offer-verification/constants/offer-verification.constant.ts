import { PdfTone } from '@core/@types/pdf-tone.type';
import { QuoteStatus } from '../@types/quote-status.type';

export const OFFER_VERIFICATION_ID = 'current';
export const FIRST_PAYMENT_MONTHS_AHEAD = 1;
export const QUOTE_TOLERANCE = 1;
export const MIN_RATE_CHANGE_MONTH = 2;
export const MIN_GRACE_MONTHS = 0;
export const BALANCE_INSURANCE_DECIMALS = 4;
export const MAX_BALANCE_INSURANCE_PERCENT = 10;
export const RATE_SEARCH_TOLERANCE = 1e-6;
export const RATE_SEARCH_MAX_ITERATIONS = 100;
export const VERIFICATION_REPORT_FILE_NAME_KEY = 'offer_verification.export.file_name';

export const QUOTE_STATUS_TONE: Record<QuoteStatus, PdfTone> = {
  matches: 'positive',
  higher: 'negative',
  lower: 'warning'
};

export const QUOTE_STATUS_CARD_CLASS: Record<QuoteStatus, string> = {
  matches: 'flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-start sm:p-6 border-primary-200 bg-primary-50 dark:border-primary-900 dark:bg-primary-950',
  higher: 'flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-start sm:p-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
  lower: 'flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-start sm:p-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
};

export const QUOTE_STATUS_ICON_CLASS: Record<QuoteStatus, string> = {
  matches: 'pi pi-check-circle flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  higher: 'pi pi-exclamation-circle flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  lower: 'pi pi-info-circle flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
};
