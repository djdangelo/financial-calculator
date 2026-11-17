import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { WizardStepKey } from '@shared/@types/wizard-step-key.type';
import { WIZARD_LABEL_CLASS, WIZARD_MARKER_CLASS, WIZARD_STEPS } from '@shared/constants/wizard.constant';
import { buildWizardStepViews } from '@shared/utils/wizard.util';

@Component({
  selector: 'app-wizard-stepper',
  standalone: true,
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './wizard-stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardStepperComponent {
  readonly current = input.required<WizardStepKey>();
  readonly completed = input<readonly WizardStepKey[]>([]);

  readonly views = computed(() => buildWizardStepViews(WIZARD_STEPS, this.current(), this.completed()));
  readonly currentNumber = computed(() => this.views().find(view => view.status === 'current')?.number ?? 1);
  readonly markerClass = WIZARD_MARKER_CLASS;
  readonly labelClass = WIZARD_LABEL_CLASS;
}
