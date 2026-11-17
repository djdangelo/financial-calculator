import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { InputNumberModule } from 'primeng/inputnumber';
import { NUMBER_LOCALE } from '@core/constants/currency.constant';
import { PERCENT_SUFFIX } from '@core/constants/finance.constant';
import { MAX_BURDEN_LIMIT_PERCENT, MIN_BURDEN_LIMIT_PERCENT } from '@core/constants/market.constant';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';

@Component({
  selector: 'app-burden-limits',
  standalone: true,
  imports: [FormsModule, TranslocoDirective, InputNumberModule, FormFieldComponent],
  templateUrl: './burden-limits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BurdenLimitsComponent {
  readonly settings = inject(AppSettingsFacade);
  readonly limits = this.settings.burdenLimits;

  readonly percentSuffix = PERCENT_SUFFIX;
  readonly locale = NUMBER_LOCALE;
  readonly minLimit = MIN_BURDEN_LIMIT_PERCENT;
  readonly maxLimit = MAX_BURDEN_LIMIT_PERCENT;
}
