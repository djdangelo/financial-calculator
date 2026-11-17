import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { AddEntryOptionsComponent } from '../../components/add-entry-options/add-entry-options.component';
import { ExpenseItemComponent } from '../../components/expense-item/expense-item.component';
import { ProfileStepComponent } from '../../components/profile-step/profile-step.component';
import { EXPENSE_OPTIONS } from '../../constants/financial-profile.constant';
import { FinancialProfileFacade } from '../../facades';

@Component({
  selector: 'app-expenses-step',
  standalone: true,
  imports: [TranslocoDirective, AddEntryOptionsComponent, ExpenseItemComponent, ProfileStepComponent],
  templateUrl: './expenses-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesStepComponent {
  readonly facade = inject(FinancialProfileFacade);
  readonly options = EXPENSE_OPTIONS;
}
