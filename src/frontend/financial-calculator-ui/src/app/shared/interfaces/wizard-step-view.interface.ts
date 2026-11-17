import { WizardStepStatus } from '@shared/@types/wizard-step-status.type';
import { WizardStep } from './wizard-step.interface';

export interface WizardStepView extends WizardStep {
  number: number;
  status: WizardStepStatus;
  reachable: boolean;
}
