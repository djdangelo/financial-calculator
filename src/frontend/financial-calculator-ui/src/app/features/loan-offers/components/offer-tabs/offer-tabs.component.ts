import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { MAX_LOAN_OFFERS, OFFER_TAB_CLASS } from '../../constants/loan-offers.constant';
import { LoanOffersFacade } from '../../facades';
import { OfferTab } from '../../interfaces/offer-tab.interface';

@Component({
  selector: 'app-offer-tabs',
  standalone: true,
  imports: [TranslocoDirective, ButtonModule],
  templateUrl: './offer-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferTabsComponent {
  readonly facade = inject(LoanOffersFacade);
  readonly maxOffers = MAX_LOAN_OFFERS;

  readonly tabs = computed<OfferTab[]>(() => {
    const activeId = this.facade.offer()?.id;
    return this.facade.offers().map((offer, index) => {
      const active = offer.id === activeId;
      return {
        id: offer.id,
        bankName: offer.bankName.trim(),
        number: index + 1,
        active,
        tabClass: OFFER_TAB_CLASS[active ? 'active' : 'idle']
      };
    });
  });
}
