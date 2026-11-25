import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import {
  AMORTIZATION_ROWS_PER_PAGE,
  AMORTIZATION_ROWS_PER_PAGE_OPTIONS,
  AMORTIZATION_TABLE_STYLE
} from '../../constants/loan-analysis.constant';
import { AmortizationRow } from '../../interfaces/amortization-row.interface';

@Component({
  selector: 'app-amortization-table',
  standalone: true,
  imports: [NgTemplateOutlet, TranslocoDirective, PrimeTemplate, TableModule, MoneyPipe],
  templateUrl: './amortization-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmortizationTableComponent {
  readonly rows = input.required<AmortizationRow[]>();
  readonly currency = input.required<CurrencyCode>();
  readonly dueDates = input<readonly string[]>([]);

  readonly hasDates = computed(() => this.dueDates().length > 0);
  readonly hasInsurance = computed(() => this.rows().some(row => row.insurance > 0));
  readonly rowsPerPage = AMORTIZATION_ROWS_PER_PAGE;
  readonly rowsPerPageOptions = AMORTIZATION_ROWS_PER_PAGE_OPTIONS;
  readonly tableStyle = AMORTIZATION_TABLE_STYLE;
}
