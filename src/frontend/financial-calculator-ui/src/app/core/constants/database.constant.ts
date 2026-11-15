import { StoreName } from '@core/@types/store-name.type';

export const DATABASE_NAME = 'financial-calculator';
export const DATABASE_VERSION = 1;
export const STORE_KEY_PATH = 'id';
export const STORE_NAMES: readonly StoreName[] = ['incomes', 'expenses', 'debts', 'loan-offers', 'settings'];
