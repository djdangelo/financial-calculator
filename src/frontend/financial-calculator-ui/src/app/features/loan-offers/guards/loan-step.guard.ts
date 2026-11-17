import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { wizardStepGuard } from '@shared/guards/wizard-step.guard';
import { LoanStepKey } from '../@types/loan-step-key.type';
import { LoanOffersFacade } from '../facades';

export function loanStepGuard(step: LoanStepKey): CanActivateFn {
  return wizardStepGuard(step, () => {
    const facade = inject(LoanOffersFacade);
    return facade.load().then(() => facade.completedSteps());
  });
}
