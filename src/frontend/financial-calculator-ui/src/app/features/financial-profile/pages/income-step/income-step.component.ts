import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { AddEntryOptionsComponent } from '../../components/add-entry-options/add-entry-options.component';
import { IncomeItemComponent } from '../../components/income-item/income-item.component';
import { ProfileStepComponent } from '../../components/profile-step/profile-step.component';
import { INCOME_OPTIONS } from '../../constants/financial-profile.constant';
import { FinancialProfileFacade } from '../../facades';

@Component({
  selector: 'app-income-step',
  standalone: true,
  imports: [TranslocoDirective, AddEntryOptionsComponent, IncomeItemComponent, ProfileStepComponent],
  templateUrl: './income-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeStepComponent {
  readonly facade = inject(FinancialProfileFacade);
  readonly options = INCOME_OPTIONS;
}
