import { LoanOffer } from '../models';
import { isDebtConsolidated, toggleConsolidatedDebt } from './consolidated-debts.function';
import { restoreLoanOffer } from './offer-factory.function';

describe('consolidated debts functions', () => {
  const offer: LoanOffer = {
    id: 'offer',
    createdAt: 1,
    bankName: '',
    currency: 'HNL',
    amount: 100000,
    annualRatePercent: 24,
    termMonths: 36,
    disbursementFeePercent: 2,
    feeMode: 'deducted',
    monthlyInsurance: 0,
    otherInitialCharges: 0,
    consolidatedDebtIds: ['card']
  };

  it('adds a debt that was not marked', () => {
    const toggled = toggleConsolidatedDebt(offer, 'car');

    expect(toggled.consolidatedDebtIds).toEqual(['card', 'car']);
    expect(isDebtConsolidated(toggled, 'car')).toBeTrue();
  });

  it('removes a debt that was marked', () => {
    const toggled = toggleConsolidatedDebt(offer, 'card');

    expect(toggled.consolidatedDebtIds).toEqual([]);
    expect(isDebtConsolidated(toggled, 'card')).toBeFalse();
  });

  it('restores offers saved before debts could be marked', () => {
    const { consolidatedDebtIds, ...stored } = offer;

    expect(consolidatedDebtIds.length).toBe(1);
    expect(restoreLoanOffer(stored as LoanOffer).consolidatedDebtIds).toEqual([]);
  });
});
