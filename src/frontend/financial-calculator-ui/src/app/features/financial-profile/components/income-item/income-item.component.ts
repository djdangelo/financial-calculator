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
import { INCOME_ICON } from '../../constants/financial-profile.constant';
import { Income } from '../../models';
import { ProfileEntryCardComponent } from '../profile-entry-card/profile-entry-card.component';

@Component({
  selector: 'app-income-item',
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
  templateUrl: './income-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeItemComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly income = input.required<Income>();
  readonly showErrors = input(false);
  readonly changed = output<Income>();
  readonly removed = output<void>();

  readonly form = inject(NonNullableFormBuilder).group({
    description: [''],
    currency: [DEFAULT_CURRENCY as CurrencyCode],
    monthlyAmount: [0, REQUIRED_MONEY_VALIDATORS],
    monthlyCosts: [0]
  });

  readonly icon = computed(() => INCOME_ICON[this.income().type]);
  readonly isBusiness = computed(() => this.income().type === 'business');
  readonly fieldId = computed(() => `income-${this.income().id}`);
  readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;

  ngOnInit(): void {
    const { description, currency, monthlyAmount, monthlyCosts } = this.income();
    this.form.setValue({ description, currency, monthlyAmount, monthlyCosts }, { emitEvent: false });
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed.emit(this.toIncome()));
  }

  private toIncome(): Income {
    const { description, currency, monthlyAmount, monthlyCosts } = this.form.getRawValue();
    return {
      ...this.income(),
      description,
      currency,
      monthlyAmount: monthlyAmount ?? 0,
      monthlyCosts: monthlyCosts ?? 0
    };
  }
}
