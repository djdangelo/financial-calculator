import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import {
  areSameExchangeRates,
  convertAmount,
  formatExchangeRate,
  formatMoney,
  sumInCurrency
} from './currency.function';

describe('currency functions', () => {
  const rates: ExchangeRates = { base: 'USD', unitsPerBase: { USD: 1, HNL: 25 }, date: '2026-01-01' };

  it('converts dollars to lempiras', () => {
    expect(convertAmount(100, 'USD', 'HNL', rates)).toBe(2500);
  });

  it('converts lempiras to dollars', () => {
    expect(convertAmount(2500, 'HNL', 'USD', rates)).toBe(100);
  });

  it('keeps the amount when both currencies match', () => {
    expect(convertAmount(1234.56, 'HNL', 'HNL', rates)).toBe(1234.56);
  });

  it('adds amounts of different currencies', () => {
    const amounts = [{ amount: 1000, currency: 'HNL' as const }, { amount: 10, currency: 'USD' as const }];

    expect(sumInCurrency(amounts, 'HNL', rates)).toBe(1250);
    expect(sumInCurrency(amounts, 'USD', rates)).toBe(50);
    expect(sumInCurrency([], 'HNL', rates)).toBe(0);
  });

  it('compares exchange rates by value', () => {
    expect(areSameExchangeRates(rates, { ...rates, unitsPerBase: { ...rates.unitsPerBase } })).toBeTrue();
    expect(areSameExchangeRates(rates, { ...rates, unitsPerBase: { USD: 1, HNL: 26 } })).toBeFalse();
    expect(areSameExchangeRates(rates, { ...rates, date: '2026-02-01' })).toBeFalse();
  });

  it('formats money with the currency symbol', () => {
    expect(formatMoney(42000, 'HNL')).toBe('L 42,000.00');
    expect(formatMoney(1680.5, 'USD')).toBe('$ 1,680.50');
    expect(formatMoney(-500, 'HNL')).toBe('-L 500.00');
  });

  it('formats an exchange rate with up to four decimals', () => {
    expect(formatExchangeRate(27.0173, 'HNL')).toBe('L 27.0173');
    expect(formatExchangeRate(25, 'HNL')).toBe('L 25.00');
  });
});
