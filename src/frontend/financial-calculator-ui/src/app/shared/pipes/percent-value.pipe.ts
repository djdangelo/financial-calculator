import { Pipe, PipeTransform } from '@angular/core';
import { formatPercent } from '@core/functions/finance.function';

@Pipe({ name: 'percentValue', standalone: true })
export class PercentValuePipe implements PipeTransform {
  transform(percent: number): string {
    return formatPercent(percent);
  }
}
