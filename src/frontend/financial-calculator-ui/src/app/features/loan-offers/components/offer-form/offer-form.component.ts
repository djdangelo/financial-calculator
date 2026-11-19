import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  untracked
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { PrimeTemplate } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { DEFAULT_CURRENCY, NUMBER_LOCALE } from '@core/constants/currency.constant';
import {
  MAX_ANNUAL_RATE_PERCENT,
  MAX_FEE_PERCENT,
  MAX_TERM_MONTHS,
  MIN_TERM_MONTHS,
  PERCENT_SUFFIX,
  RATE_DECIMALS
} from '@core/constants/finance.constant';
import { CurrencyToggleComponent } from '@shared/components/currency-toggle/currency-toggle.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { MoneyInputComponent } from '@shared/components/money-input/money-input.component';
import { REQUIRED_MONEY_VALIDATORS } from '@shared/constants/form.constant';
import { FeeMode } from '../../@types/fee-mode.type';
import { BANK_NAME_MAX_LENGTH, DEFAULT_FEE_MODE, FEE_MODES } from '../../constants/loan-offers.constant';
import { hasPositiveDisbursement, isAnnualRateValid, isTermValid } from '../../functions/offer-validation.function';
import { LoanOffer } from '../../models';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    PrimeTemplate,
    InputNumberModule,
    InputTextModule,
    SelectButtonModule,
    CurrencyToggleComponent,
    FormFieldComponent,
    MoneyInputComponent
  ],
  templateUrl: './offer-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly offer = input.required<LoanOffer>();
  readonly showErrors = input(false);
  readonly changed = output<LoanOffer>();

  readonly form = this.formBuilder.group({
    bankName: [''],
    currency: [DEFAULT_CURRENCY as CurrencyCode],
    amount: [0, REQUIRED_MONEY_VALIDATORS],
    annualRatePercent: this.formBuilder.control<number | null>(null),
    termMonths: this.formBuilder.control<number | null>(null),
    disbursementFeePercent: this.formBuilder.control<number | null>(null),
    feeMode: [DEFAULT_FEE_MODE as FeeMode],
    monthlyInsurance: [0, Validators.min(0)],
    otherInitialCharges: [0, Validators.min(0)]
  });

  private readonly offerId = computed(() => this.offer().id);

  readonly hasFee = computed(() => this.offer().disbursementFeePercent > 0);
  readonly rateError = computed(() => this.showErrors() && !isAnnualRateValid(this.offer().annualRatePercent));
  readonly termError = computed(() => this.showErrors() && !isTermValid(this.offer().termMonths));
  readonly disbursementError = computed(() => this.offer().amount > 0 && !hasPositiveDisbursement(this.offer()));

  readonly feeModes = FEE_MODES;
  readonly bankNameMaxLength = BANK_NAME_MAX_LENGTH;
  readonly locale = NUMBER_LOCALE;
  readonly percentSuffix = PERCENT_SUFFIX;
  readonly maxRate = MAX_ANNUAL_RATE_PERCENT;
  readonly maxFee = MAX_FEE_PERCENT;
  readonly rateDecimals = RATE_DECIMALS;
  readonly minTerm = MIN_TERM_MONTHS;
  readonly maxTerm = MAX_TERM_MONTHS;

  constructor() {
    effect(() => {
      this.offerId();
      untracked(() => this.fillForm(this.offer()));
    });
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed.emit(this.toOffer()));
  }

  private fillForm(offer: LoanOffer): void {
    this.form.setValue(
      {
        bankName: offer.bankName,
        currency: offer.currency,
        amount: offer.amount,
        annualRatePercent: offer.annualRatePercent || null,
        termMonths: offer.termMonths || null,
        disbursementFeePercent: offer.disbursementFeePercent || null,
        feeMode: offer.feeMode,
        monthlyInsurance: offer.monthlyInsurance,
        otherInitialCharges: offer.otherInitialCharges
      },
      { emitEvent: false }
    );
  }

  private toOffer(): LoanOffer {
    const value = this.form.getRawValue();
    return {
      ...this.offer(),
      ...value,
      amount: value.amount ?? 0,
      annualRatePercent: value.annualRatePercent ?? 0,
      termMonths: value.termMonths ?? 0,
      disbursementFeePercent: value.disbursementFeePercent ?? 0,
      monthlyInsurance: value.monthlyInsurance ?? 0,
      otherInitialCharges: value.otherInitialCharges ?? 0
    };
  }
}
