import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { RESULT_HELP_TERMS } from '../../constants/loan-analysis.constant';

@Component({
  selector: 'app-result-help',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './result-help.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultHelpComponent {
  readonly terms = RESULT_HELP_TERMS;
  readonly limits = inject(AppSettingsFacade).burdenLimits;
}
