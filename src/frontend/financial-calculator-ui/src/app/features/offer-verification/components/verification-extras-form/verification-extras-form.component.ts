import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
  output,
  untracked
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { NUMBER_LOCALE } from '@core/constants/currency.constant';
import {
  MAX_ANNUAL_RATE_PERCENT,
  MAX_TERM_MONTHS,
  PERCENT_SUFFIX,
  RATE_DECIMALS
} from '@core/constants/finance.constant';
import { isIsoDate } from '@core/functions/date.function';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { MoneyInputComponent } from '@shared/components/money-input/money-input.component';
import {
  BALANCE_INSURANCE_DECIMALS,
  MAX_BALANCE_INSURANCE_PERCENT,
  MIN_GRACE_MONTHS,
  MIN_RATE_CHANGE_MONTH
} from '../../constants/offer-verification.constant';
import { hasRateChange, hasSpecialConditions } from '../../functions/verification-factory.function';
import {
  isBalanceInsuranceValid,
  isGraceValid,
  isRateChangeValid
} from '../../functions/verification-validation.function';
import { OfferVerification } from '../../models';

@Component({
  selector: 'app-verification-extras-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective, InputNumberModule, InputTextModule, FormFieldComponent, MoneyInputComponent],
  templateUrl: './verification-extras-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationExtrasFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly verification = input.required<OfferVerification>();
  readonly showErrors = input(false);
  readonly changed = output<OfferVerification>();

  readonly form = this.formBuilder.group({
    firstPaymentDate: [''],
    quotedPayment: [0, Validators.min(0)],
    balanceInsuranceRatePercent: this.formBuilder.control<number | null>(null),
    graceMonths: this.formBuilder.control<number | null>(null),
    rateChangeMonth: this.formBuilder.control<number | null>(null),
    rateChangeAnnualRatePercent: this.formBuilder.control<number | null>(null),
    extraMonthlyPayment: [0, Validators.min(0)]
  });

  private readonly verificationId = computed(() => this.verification().id);

  readonly dateError = computed(() => this.showErrors() && !isIsoDate(this.verification().firstPaymentDate));
  readonly graceError = computed(() => {
    const { graceMonths, termMonths } = this.verification();
    return graceMonths > 0 && !isGraceValid(graceMonths, termMonths);
  });
  readonly rateChangeError = computed(() => {
    const verification = this.verification();
    const started = hasRateChange(verification) || verification.rateChangeAnnualRatePercent > 0;
    return started && this.showErrors() && !isRateChangeValid(verification);
  });
  readonly balanceInsuranceError = computed(() => !isBalanceInsuranceValid(this.verification().balanceInsuranceRatePercent));
  readonly startsOpen = signal(false);

  readonly locale = NUMBER_LOCALE;
  readonly percentSuffix = PERCENT_SUFFIX;
  readonly rateDecimals = RATE_DECIMALS;
  readonly insuranceDecimals = BALANCE_INSURANCE_DECIMALS;
  readonly maxRate = MAX_ANNUAL_RATE_PERCENT;
  readonly maxInsurance = MAX_BALANCE_INSURANCE_PERCENT;
  readonly maxTerm = MAX_TERM_MONTHS;
  readonly minGrace = MIN_GRACE_MONTHS;
  readonly minRateChangeMonth = MIN_RATE_CHANGE_MONTH;

  constructor() {
    effect(() => {
      this.verificationId();
      untracked(() => this.fillForm(this.verification()));
    });
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed.emit(this.toVerification()));
  }

  private fillForm(verification: OfferVerification): void {
    this.startsOpen.set(hasSpecialConditions(verification));
    this.form.setValue(
      {
        firstPaymentDate: verification.firstPaymentDate,
        quotedPayment: verification.quotedPayment,
        balanceInsuranceRatePercent: verification.balanceInsuranceRatePercent || null,
        graceMonths: verification.graceMonths || null,
        rateChangeMonth: verification.rateChangeMonth || null,
        rateChangeAnnualRatePercent: verification.rateChangeAnnualRatePercent || null,
        extraMonthlyPayment: verification.extraMonthlyPayment
      },
      { emitEvent: false }
    );
  }

  private toVerification(): OfferVerification {
    const value = this.form.getRawValue();
    return {
      ...this.verification(),
      firstPaymentDate: value.firstPaymentDate,
      quotedPayment: value.quotedPayment ?? 0,
      balanceInsuranceRatePercent: value.balanceInsuranceRatePercent ?? 0,
      graceMonths: value.graceMonths ?? 0,
      rateChangeMonth: value.rateChangeMonth ?? 0,
      rateChangeAnnualRatePercent: value.rateChangeAnnualRatePercent ?? 0,
      extraMonthlyPayment: value.extraMonthlyPayment ?? 0
    };
  }
}
