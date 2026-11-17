import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { MessageModule } from 'primeng/message';
import { WizardNavigationComponent } from '@shared/components/wizard-navigation/wizard-navigation.component';
import { WizardStepperComponent } from '@shared/components/wizard-stepper/wizard-stepper.component';
import { WIZARD_STEPS } from '@shared/constants/wizard.constant';
import { findNextRoute, findPreviousRoute } from '@shared/utils/wizard.util';
import { ProfileStepKey } from '../../@types/profile-step-key.type';
import { FinancialProfileFacade } from '../../facades';
import { ProfileSummaryComponent } from '../profile-summary/profile-summary.component';

@Component({
  selector: 'app-profile-step',
  standalone: true,
  imports: [
    TranslocoDirective,
    MessageModule,
    WizardNavigationComponent,
    WizardStepperComponent,
    ProfileSummaryComponent
  ],
  templateUrl: './profile-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileStepComponent {
  private readonly router = inject(Router);

  readonly facade = inject(FinancialProfileFacade);
  readonly step = input.required<ProfileStepKey>();
  readonly complete = input.required<boolean>();

  readonly attempted = signal(false);
  readonly previousRoute = computed(() => findPreviousRoute(WIZARD_STEPS, this.step()));
  readonly nextRoute = computed(() => findNextRoute(WIZARD_STEPS, this.step()));
  readonly hasNext = computed(() => this.nextRoute() !== null);
  readonly showIncomplete = computed(() => this.attempted() && !this.complete());

  continue(): void {
    const nextRoute = this.nextRoute();
    if (!this.complete() || nextRoute === null) {
      this.attempted.set(true);
      return;
    }
    this.router.navigateByUrl(nextRoute);
  }
}
