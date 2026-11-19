import { CurrencyCode } from '@core/@types/currency-code.type';
import { convertAmount } from '@core/functions/currency.function';
import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { BestOffers } from '../@types/best-offers.type';
import { MIN_OFFERS_TO_COMPARE } from '../constants/loan-analysis.constant';
import { OfferComparison } from '../interfaces/offer-comparison.interface';

export function findLowestOfferId(
  comparisons: readonly OfferComparison[],
  measure: (comparison: OfferComparison) => number
): string | null {
  if (comparisons.length < MIN_OFFERS_TO_COMPARE) {
    return null;
  }
  const lowest = comparisons.reduce((best, current) => (measure(current) < measure(best) ? current : best));
  return lowest.offer.id;
}

export function findBestOffers(
  comparisons: readonly OfferComparison[],
  currency: CurrencyCode,
  rates: ExchangeRates
): BestOffers {
  const inCurrency = (comparison: OfferComparison, amount: number) =>
    convertAmount(amount, comparison.analysis.currency, currency, rates);

  return {
    'monthly-payment': findLowestOfferId(comparisons, item => inCurrency(item, item.analysis.cost.monthlyPayment)),
    'total-cost': findLowestOfferId(comparisons, item => inCurrency(item, item.analysis.cost.totalCost)),
    'effective-cost': findLowestOfferId(comparisons, item => item.analysis.cost.effectiveAnnualCostPercent)
  };
}
