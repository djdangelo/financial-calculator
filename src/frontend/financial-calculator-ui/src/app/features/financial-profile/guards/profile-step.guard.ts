import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WIZARD_START_ROUTE, WIZARD_STEPS } from '@shared/constants/wizard.constant';
import { findStepRoute } from '@shared/utils/wizard.util';
import { ProfileStepKey } from '../@types/profile-step-key.type';
import { FinancialProfileFacade } from '../facades';
import { findPendingStepBefore } from '../functions/profile-validation.function';

export function profileStepGuard(step: ProfileStepKey): CanActivateFn {
  return async () => {
    const facade = inject(FinancialProfileFacade);
    const router = inject(Router);

    await facade.load();
    const pendingStep = findPendingStepBefore(step, facade.completedSteps());
    if (pendingStep === null) {
      return true;
    }
    return router.parseUrl(findStepRoute(WIZARD_STEPS, pendingStep) ?? WIZARD_START_ROUTE);
  };
}
