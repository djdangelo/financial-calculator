import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { wizardStepGuard } from '@shared/guards/wizard-step.guard';
import { ProfileStepKey } from '../@types/profile-step-key.type';
import { FinancialProfileFacade } from '../facades';

export function profileStepGuard(step: ProfileStepKey): CanActivateFn {
  return wizardStepGuard(step, () => {
    const facade = inject(FinancialProfileFacade);
    return facade.load().then(() => facade.completedSteps());
  });
}
