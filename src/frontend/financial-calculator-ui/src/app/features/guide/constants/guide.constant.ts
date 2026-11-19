import { GuideOutcome } from '../@types/guide-outcome.type';
import { GuideExample } from '../interfaces/guide-example.interface';
import { GuideItem } from '../interfaces/guide-item.interface';

export const GUIDE_PREPARATION: readonly GuideItem[] = [
  { key: 'payslip', icon: 'pi pi-file' },
  { key: 'expenses', icon: 'pi pi-shopping-cart' },
  { key: 'statements', icon: 'pi pi-credit-card' },
  { key: 'quote', icon: 'pi pi-building-columns' }
];

export const GUIDE_STEPS: readonly GuideItem[] = [
  { key: 'income', icon: 'pi pi-wallet' },
  { key: 'expenses', icon: 'pi pi-shopping-cart' },
  { key: 'debts', icon: 'pi pi-credit-card' },
  { key: 'offer', icon: 'pi pi-building-columns' },
  { key: 'result', icon: 'pi pi-chart-line' }
];

export const GUIDE_EXAMPLES: readonly GuideExample[] = [
  { key: 'ana', icon: 'pi pi-car', facts: ['income', 'expenses', 'debts', 'offer'], outcome: 'positive' },
  { key: 'carlos', icon: 'pi pi-shop', facts: ['income', 'expenses', 'debts', 'offer', 'how'], outcome: 'warning' },
  { key: 'maria', icon: 'pi pi-arrows-h', facts: ['need', 'offer_a', 'offer_b', 'how'], outcome: 'positive' }
];

export const GUIDE_FAQ: readonly string[] = ['privacy', 'delete', 'limits', 'effective_cost', 'currency', 'offline', 'advice'];

export const GUIDE_OUTCOME_CLASS: Record<GuideOutcome, string> = {
  positive: 'flex items-start gap-3 rounded-xl border p-4 border-primary-200 bg-primary-50 dark:border-primary-900 dark:bg-primary-950',
  warning: 'flex items-start gap-3 rounded-xl border p-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
};

export const GUIDE_OUTCOME_ICON: Record<GuideOutcome, string> = {
  positive: 'pi pi-check-circle mt-0.5 text-lg text-primary-700 dark:text-primary-300',
  warning: 'pi pi-exclamation-triangle mt-0.5 text-lg text-amber-700 dark:text-amber-300'
};
