import { WizardLayout } from '@shared/@types/wizard-layout.type';
import { WizardStepStatus } from '@shared/@types/wizard-step-status.type';
import { WizardStep } from '@shared/interfaces/wizard-step.interface';

export const WIZARD_HOME_ROUTE = '/';
export const WIZARD_START_ROUTE = '/profile/income';

export const WIZARD_STEPS: readonly WizardStep[] = [
  { key: 'income', route: WIZARD_START_ROUTE },
  { key: 'expenses', route: '/profile/expenses' },
  { key: 'debts', route: '/profile/debts' },
  { key: 'offer', route: '/offer' },
  { key: 'result', route: '/result' }
];

export const WIZARD_MARKER_CLASS: Record<WizardStepStatus, string> = {
  complete: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors bg-primary text-primary-contrast',
  current: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors border-2 border-primary bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
  upcoming: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors border border-surface-300 text-surface-500 dark:border-surface-700 dark:text-surface-400'
};

export const WIZARD_LABEL_CLASS: Record<WizardStepStatus, string> = {
  complete: 'hidden text-sm md:inline font-semibold text-surface-700 dark:text-surface-200',
  current: 'hidden text-sm md:inline font-bold text-surface-900 dark:text-surface-0',
  upcoming: 'hidden text-sm md:inline font-medium text-surface-500 dark:text-surface-400'
};

export const WIZARD_LAYOUT_CLASS: Record<WizardLayout, string> = {
  'with-aside': 'mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start',
  full: 'mt-8 grid gap-8'
};
