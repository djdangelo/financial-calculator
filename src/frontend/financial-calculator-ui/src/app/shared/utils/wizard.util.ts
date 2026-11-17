import { WizardStepKey } from '@shared/@types/wizard-step-key.type';
import { WizardStepStatus } from '@shared/@types/wizard-step-status.type';
import { WizardStepView } from '@shared/interfaces/wizard-step-view.interface';
import { WizardStep } from '@shared/interfaces/wizard-step.interface';

export function buildWizardStepViews(
  steps: readonly WizardStep[],
  current: WizardStepKey,
  completed: readonly WizardStepKey[]
): WizardStepView[] {
  const currentIndex = findStepIndex(steps, current);
  return steps.map((step, index) => ({
    ...step,
    number: index + 1,
    status: resolveStepStatus(index, currentIndex, completed.includes(step.key)),
    reachable: step.route !== null && steps.slice(0, index).every(previous => completed.includes(previous.key))
  }));
}

export function findStepRoute(steps: readonly WizardStep[], key: WizardStepKey): string | null {
  return steps.find(step => step.key === key)?.route ?? null;
}

export function findPreviousRoute(steps: readonly WizardStep[], current: WizardStepKey): string | null {
  return steps[findStepIndex(steps, current) - 1]?.route ?? null;
}

export function findNextRoute(steps: readonly WizardStep[], current: WizardStepKey): string | null {
  return steps[findStepIndex(steps, current) + 1]?.route ?? null;
}

function findStepIndex(steps: readonly WizardStep[], key: WizardStepKey): number {
  return steps.findIndex(step => step.key === key);
}

function resolveStepStatus(index: number, currentIndex: number, isCompleted: boolean): WizardStepStatus {
  if (index === currentIndex) {
    return 'current';
  }
  return index < currentIndex && isCompleted ? 'complete' : 'upcoming';
}
