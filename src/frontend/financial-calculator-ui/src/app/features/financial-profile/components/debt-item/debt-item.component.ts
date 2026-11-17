import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { DEFAULT_CURRENCY, NUMBER_LOCALE } from '@core/constants/currency.constant';
import { CurrencyToggleComponent } from '@shared/components/currency-toggle/currency-toggle.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { MoneyInputComponent } from '@shared/components/money-input/money-input.component';
import { DESCRIPTION_MAX_LENGTH, REQUIRED_MONEY_VALIDATORS } from '@shared/constants/form.constant';
import {
  DEBT_ICON,
  MAX_ANNUAL_RATE_PERCENT,
  MAX_REMAINING_MONTHS,
  MIN_REMAINING_MONTHS,
  RATE_DECIMALS
} from '../../constants/financial-profile.constant';
import { Debt } from '../../models';
import { ProfileEntryCardComponent } from '../profile-entry-card/profile-entry-card.component';

@Component({
  selector: 'app-debt-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    InputNumberModule,
    InputTextModule,
    CurrencyToggleComponent,
    FormFieldComponent,
    MoneyInputComponent,
    ProfileEntryCardComponent
  ],
  templateUrl: './debt-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtItemComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly debt = input.required<Debt>();
  readonly showErrors = input(false);
  readonly changed = output<Debt>();
  readonly removed = output<void>();

  readonly form = this.formBuilder.group({
    description: [''],
    currency: [DEFAULT_CURRENCY as CurrencyCode],
    monthlyPayment: [0, REQUIRED_MONEY_VALIDATORS],
    balance: [0, REQUIRED_MONEY_VALIDATORS],
    annualRatePercent: this.formBuilder.control<number | null>(null),
    remainingMonths: this.formBuilder.control<number | null>(null)
  });

  readonly icon = computed(() => DEBT_ICON[this.debt().type]);
  readonly fieldId = computed(() => `debt-${this.debt().id}`);
  readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;
  readonly locale = NUMBER_LOCALE;
  readonly maxRate = MAX_ANNUAL_RATE_PERCENT;
  readonly rateDecimals = RATE_DECIMALS;
  readonly minMonths = MIN_REMAINING_MONTHS;
  readonly maxMonths = MAX_REMAINING_MONTHS;

  ngOnInit(): void {
    const { description, currency, monthlyPayment, balance, annualRatePercent, remainingMonths } = this.debt();
    this.form.setValue(
      { description, currency, monthlyPayment, balance, annualRatePercent, remainingMonths },
      { emitEvent: false }
    );
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed.emit(this.toDebt()));
  }

  private toDebt(): Debt {
    const { monthlyPayment, balance, ...rest } = this.form.getRawValue();
    return { ...this.debt(), ...rest, monthlyPayment: monthlyPayment ?? 0, balance: balance ?? 0 };
  }
}
