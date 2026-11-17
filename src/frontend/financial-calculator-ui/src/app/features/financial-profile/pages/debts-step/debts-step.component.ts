import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { AddEntryOptionsComponent } from '../../components/add-entry-options/add-entry-options.component';
import { DebtItemComponent } from '../../components/debt-item/debt-item.component';
import { ProfileStepComponent } from '../../components/profile-step/profile-step.component';
import { DEBT_OPTIONS } from '../../constants/financial-profile.constant';
import { FinancialProfileFacade } from '../../facades';

@Component({
  selector: 'app-debts-step',
  standalone: true,
  imports: [TranslocoDirective, AddEntryOptionsComponent, DebtItemComponent, ProfileStepComponent],
  templateUrl: './debts-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtsStepComponent {
  readonly facade = inject(FinancialProfileFacade);
  readonly options = DEBT_OPTIONS;
}
