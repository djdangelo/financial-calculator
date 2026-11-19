import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { CurrencyCode } from '@core/@types/currency-code.type';
import { DEBT_ICON } from '@features/financial-profile/constants/financial-profile.constant';
import { Debt } from '@features/financial-profile/models';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import {
  CONSOLIDATION_DEBT_ROW_CLASS,
  CONSOLIDATION_RESULT_CLASS,
  CONSOLIDATION_RESULT_ICON
} from '../../constants/loan-analysis.constant';
import { ConsolidationDebtOption } from '../../interfaces/consolidation-debt-option.interface';
import { DebtConsolidation } from '../../interfaces/debt-consolidation.interface';

@Component({
  selector: 'app-debt-consolidation',
  standalone: true,
  imports: [FormsModule, TranslocoDirective, TranslocoPipe, CheckboxModule, MoneyPipe],
  templateUrl: './debt-consolidation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtConsolidationComponent {
  readonly debts = input.required<readonly Debt[]>();
  readonly consolidatedDebts = input.required<readonly Debt[]>();
  readonly consolidation = input.required<DebtConsolidation | null>();
  readonly currency = input.required<CurrencyCode>();
  readonly toggled = output<string>();

  readonly options = computed<ConsolidationDebtOption[]>(() => {
    const selected = new Set(this.consolidatedDebts().map(debt => debt.id));
    return this.debts().map(debt => {
      const isSelected = selected.has(debt.id);
      return {
        debt,
        icon: DEBT_ICON[debt.type],
        selected: isSelected,
        rowClass: CONSOLIDATION_DEBT_ROW_CLASS[isSelected ? 'selected' : 'idle']
      };
    });
  });

  private readonly resultState = computed(() => (this.consolidation()?.recommended ? 'within' : 'over'));
  readonly resultClass = computed(() => CONSOLIDATION_RESULT_CLASS[this.resultState()]);
  readonly resultIcon = computed(() => CONSOLIDATION_RESULT_ICON[this.resultState()]);

  readonly lowersPayment = computed(() => (this.consolidation()?.monthlySavings ?? 0) > 0);
  readonly paymentDifference = computed(() => Math.abs(this.consolidation()?.monthlySavings ?? 0));
  readonly coversDebts = computed(() => (this.consolidation()?.cashLeft ?? 0) >= 0);
  readonly cashDifference = computed(() => Math.abs(this.consolidation()?.cashLeft ?? 0));
  readonly costsMore = computed(() => (this.consolidation()?.extraTotalCost ?? 0) > 0);
  readonly totalDifference = computed(() => Math.abs(this.consolidation()?.extraTotalCost ?? 0));
}
