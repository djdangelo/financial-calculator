import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { convertAmount } from './currency.function';

describe('convertAmount', () => {
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
});
