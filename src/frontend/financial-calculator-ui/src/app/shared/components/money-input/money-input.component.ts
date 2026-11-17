import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { InputNumberModule } from 'primeng/inputnumber';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { CURRENCIES, NUMBER_LOCALE } from '@core/constants/currency.constant';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-money-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective, InputNumberModule, FormFieldComponent],
  templateUrl: './money-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoneyInputComponent {
  readonly control = input.required<FormControl<number>>();
  readonly currency = input.required<CurrencyCode>();
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly hint = input('');
  readonly showErrors = input(false);

  readonly prefix = computed(() => `${CURRENCIES[this.currency()].symbol} `);
  readonly decimals = computed(() => CURRENCIES[this.currency()].decimals);
  readonly locale = NUMBER_LOCALE;

  get isInvalid(): boolean {
    const control = this.control();
    return control.invalid && (control.touched || this.showErrors());
  }

  get isMarkedDirty(): boolean {
    return this.control().dirty || this.showErrors();
  }
}
