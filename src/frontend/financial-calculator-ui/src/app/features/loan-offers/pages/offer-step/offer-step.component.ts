import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { WizardStepFrameComponent } from '@shared/components/wizard-step-frame/wizard-step-frame.component';
import { OfferFormComponent } from '../../components/offer-form/offer-form.component';
import { OfferPreviewComponent } from '../../components/offer-preview/offer-preview.component';
import { LoanOffersFacade } from '../../facades';

@Component({
  selector: 'app-offer-step',
  standalone: true,
  imports: [TranslocoDirective, WizardStepFrameComponent, OfferFormComponent, OfferPreviewComponent],
  templateUrl: './offer-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferStepComponent {
  readonly facade = inject(LoanOffersFacade);
  readonly attempted = signal(false);
}
