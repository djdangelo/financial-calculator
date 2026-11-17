import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { CURRENCY_OPTIONS } from '@shared/constants/form.constant';

@Component({
  selector: 'app-currency-toggle',
  standalone: true,
  imports: [FormsModule, SelectButtonModule],
  templateUrl: './currency-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyToggleComponent {
  readonly value = model.required<CurrencyCode>();
  readonly labelledBy = input<string>();

  readonly options = CURRENCY_OPTIONS;
}
