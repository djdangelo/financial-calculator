import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { WIZARD_START_ROUTE } from '@shared/constants/wizard.constant';
import {
  GUIDE_EXAMPLES,
  GUIDE_FAQ,
  GUIDE_OUTCOME_CLASS,
  GUIDE_OUTCOME_ICON,
  GUIDE_PREPARATION,
  GUIDE_STEPS
} from '../../constants/guide.constant';
import { GuideExampleView } from '../../interfaces/guide-example-view.interface';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, ButtonModule],
  templateUrl: './guide.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideComponent {
  readonly preparation = GUIDE_PREPARATION;
  readonly steps = GUIDE_STEPS;
  readonly faq = GUIDE_FAQ;
  readonly startRoute = WIZARD_START_ROUTE;
  readonly examples: readonly GuideExampleView[] = GUIDE_EXAMPLES.map(example => ({
    ...example,
    outcomeClass: GUIDE_OUTCOME_CLASS[example.outcome],
    outcomeIcon: GUIDE_OUTCOME_ICON[example.outcome]
  }));
}
