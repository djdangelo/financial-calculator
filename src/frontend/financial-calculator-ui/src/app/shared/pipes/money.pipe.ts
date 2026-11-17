import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { formatMoney } from '@core/functions/currency.function';

@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(amount: number, currency: CurrencyCode): string {
    return formatMoney(amount, currency);
  }
}
