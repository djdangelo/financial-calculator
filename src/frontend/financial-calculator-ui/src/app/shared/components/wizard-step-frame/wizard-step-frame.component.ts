import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { WizardLayout } from '@shared/@types/wizard-layout.type';
import { WizardStepKey } from '@shared/@types/wizard-step-key.type';
import { WIZARD_LAYOUT_CLASS, WIZARD_STEPS } from '@shared/constants/wizard.constant';
import { findNextRoute, findPreviousRoute } from '@shared/utils/wizard.util';
import { WizardNavigationComponent } from '../wizard-navigation/wizard-navigation.component';
import { WizardStepperComponent } from '../wizard-stepper/wizard-stepper.component';

@Component({
  selector: 'app-wizard-step-frame',
  standalone: true,
  imports: [MessageModule, WizardNavigationComponent, WizardStepperComponent],
  templateUrl: './wizard-step-frame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardStepFrameComponent {
  private readonly router = inject(Router);

  readonly step = input.required<WizardStepKey>();
  readonly completed = input<readonly WizardStepKey[]>([]);
  readonly complete = input(true);
  readonly title = input.required<string>();
  readonly description = input('');
  readonly incompleteMessage = input('');
  readonly layout = input<WizardLayout>('with-aside');
  readonly attempted = model(false);

  readonly layoutClass = computed(() => WIZARD_LAYOUT_CLASS[this.layout()]);
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
