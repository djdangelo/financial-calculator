import { WizardStepKey } from '@shared/@types/wizard-step-key.type';

export type ProfileStepKey = Extract<WizardStepKey, 'income' | 'expenses' | 'debts'>;
