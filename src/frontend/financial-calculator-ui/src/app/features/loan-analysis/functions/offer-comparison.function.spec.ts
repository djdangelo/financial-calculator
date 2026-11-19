import { DEFAULT_BURDEN_LIMITS } from '@core/constants/market.constant';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { LoanOffer } from '@features/loan-offers/models';
import { OfferComparison } from '../interfaces/offer-comparison.interface';
import { analyzeLoan } from './loan-analysis.function';
import { findBestOffers, findLowestOfferId } from './offer-comparison.function';

describe('offer comparison functions', () => {
  const rates: ExchangeRates = { base: 'USD', unitsPerBase: { USD: 1, HNL: 25 }, date: '2026-11-18' };
  const baseOffer: LoanOffer = {
    id: 'short',
    createdAt: 1,
    bankName: 'Banco A',
    currency: 'HNL',
    amount: 100000,
    annualRatePercent: 24,
    termMonths: 12,
    disbursementFeePercent: 2,
    feeMode: 'deducted',
    monthlyInsurance: 0,
    otherInitialCharges: 0,
    consolidatedDebtIds: []
  };
  const compare = (offer: LoanOffer): OfferComparison => ({
    offer,
    position: 1,
    analysis: analyzeLoan({ offer, netIncome: 50000, expenses: 10000, currentDebtPayments: 0, limits: DEFAULT_BURDEN_LIMITS })
  });
  const short = compare(baseOffer);
  const long = compare({ ...baseOffer, id: 'long', termMonths: 48 });
  const cheap = compare({ ...baseOffer, id: 'cheap', annualRatePercent: 18, disbursementFeePercent: 0 });

  it('needs at least two offers to pick one', () => {
    expect(findLowestOfferId([short], item => item.analysis.cost.monthlyPayment)).toBeNull();
  });

  it('finds the lowest payment, total cost and effective cost', () => {
    const best = findBestOffers([short, long, cheap], 'HNL', rates);

    expect(best['monthly-payment']).toBe('long');
    expect(best['total-cost']).toBe('cheap');
    expect(best['effective-cost']).toBe('cheap');
  });

  it('compares amounts of offers in different currencies', () => {
    const dollars = compare({ ...baseOffer, id: 'dollars', currency: 'USD', amount: 5000 });
    const best = findBestOffers([short, dollars], 'HNL', rates);

    expect(best['monthly-payment']).toBe('short');
  });
});
