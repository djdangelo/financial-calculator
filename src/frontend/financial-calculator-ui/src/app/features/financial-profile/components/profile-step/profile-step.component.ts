import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { WizardStepFrameComponent } from '@shared/components/wizard-step-frame/wizard-step-frame.component';
import { ProfileStepKey } from '../../@types/profile-step-key.type';
import { FinancialProfileFacade } from '../../facades';
import { ProfileSummaryComponent } from '../profile-summary/profile-summary.component';

@Component({
  selector: 'app-profile-step',
  standalone: true,
  imports: [TranslocoDirective, WizardStepFrameComponent, ProfileSummaryComponent],
  templateUrl: './profile-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileStepComponent {
  readonly facade = inject(FinancialProfileFacade);
  readonly step = input.required<ProfileStepKey>();
  readonly complete = input.required<boolean>();

  readonly attempted = signal(false);
}
