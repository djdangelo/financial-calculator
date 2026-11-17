import { WizardStepKey } from '@shared/@types/wizard-step-key.type';

export type LoanStepKey = Extract<WizardStepKey, 'offer' | 'result'>;
