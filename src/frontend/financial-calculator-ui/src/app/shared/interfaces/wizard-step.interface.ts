import { WizardStepKey } from '@shared/@types/wizard-step-key.type';

export interface WizardStep {
  key: WizardStepKey;
  route: string | null;
}
