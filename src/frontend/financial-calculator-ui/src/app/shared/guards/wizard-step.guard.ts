import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WizardStepKey } from '@shared/@types/wizard-step-key.type';
import { WIZARD_START_ROUTE, WIZARD_STEPS } from '@shared/constants/wizard.constant';
import { findPendingStepBefore } from '@shared/utils/wizard.util';

export function wizardStepGuard(
  step: WizardStepKey,
  loadCompletedSteps: () => Promise<readonly WizardStepKey[]>
): CanActivateFn {
  return async () => {
    const router = inject(Router);
    const completedSteps = await loadCompletedSteps();
    const pendingStep = findPendingStepBefore(WIZARD_STEPS, step, completedSteps);
    if (pendingStep === null) {
      return true;
    }
    return router.parseUrl(pendingStep.route ?? WIZARD_START_ROUTE);
  };
}
