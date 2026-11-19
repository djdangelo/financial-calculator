import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { PercentValuePipe } from '@shared/pipes/percent-value.pipe';
import { BestOffers } from '../../@types/best-offers.type';
import { COMPARISON_COLUMN_CLASS, VERDICT_ICON } from '../../constants/loan-analysis.constant';
import { OfferComparisonColumn } from '../../interfaces/offer-comparison-column.interface';
import { OfferComparison } from '../../interfaces/offer-comparison.interface';

@Component({
  selector: 'app-offer-comparison',
  standalone: true,
  imports: [NgTemplateOutlet, TranslocoDirective, TranslocoPipe, ButtonModule, MoneyPipe, PercentValuePipe],
  templateUrl: './offer-comparison.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferComparisonComponent {
  readonly comparisons = input.required<readonly OfferComparison[]>();
  readonly best = input.required<BestOffers>();
  readonly activeOfferId = input.required<string | null>();
  readonly selected = output<string>();

  readonly columns = computed<OfferComparisonColumn[]>(() =>
    this.comparisons().map(comparison => {
      const active = comparison.offer.id === this.activeOfferId();
      return {
        ...comparison,
        active,
        columnClass: COMPARISON_COLUMN_CLASS[active ? 'active' : 'idle'],
        verdictIcon: VERDICT_ICON[comparison.analysis.verdict]
      };
    })
  );
}
