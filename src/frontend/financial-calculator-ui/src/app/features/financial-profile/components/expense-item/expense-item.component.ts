import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { DEFAULT_CURRENCY } from '@core/constants/currency.constant';
import { CurrencyToggleComponent } from '@shared/components/currency-toggle/currency-toggle.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { MoneyInputComponent } from '@shared/components/money-input/money-input.component';
import { DESCRIPTION_MAX_LENGTH, REQUIRED_MONEY_VALIDATORS } from '@shared/constants/form.constant';
import { EXPENSE_ICON } from '../../constants/financial-profile.constant';
import { Expense } from '../../models';
import { ProfileEntryCardComponent } from '../profile-entry-card/profile-entry-card.component';

@Component({
  selector: 'app-expense-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    InputTextModule,
    CurrencyToggleComponent,
    FormFieldComponent,
    MoneyInputComponent,
    ProfileEntryCardComponent
  ],
  templateUrl: './expense-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseItemComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly expense = input.required<Expense>();
  readonly showErrors = input(false);
  readonly changed = output<Expense>();
  readonly removed = output<void>();

  readonly form = inject(NonNullableFormBuilder).group({
    description: [''],
    currency: [DEFAULT_CURRENCY as CurrencyCode],
    monthlyAmount: [0, REQUIRED_MONEY_VALIDATORS]
  });

  readonly icon = computed(() => EXPENSE_ICON[this.expense().category]);
  readonly fieldId = computed(() => `expense-${this.expense().id}`);
  readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;

  ngOnInit(): void {
    const { description, currency, monthlyAmount } = this.expense();
    this.form.setValue({ description, currency, monthlyAmount }, { emitEvent: false });
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed.emit(this.toExpense()));
  }

  private toExpense(): Expense {
    const { description, currency, monthlyAmount } = this.form.getRawValue();
    return { ...this.expense(), description, currency, monthlyAmount: monthlyAmount ?? 0 };
  }
}
