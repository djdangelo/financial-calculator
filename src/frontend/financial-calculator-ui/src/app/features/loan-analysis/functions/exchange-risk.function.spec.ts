import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Income } from '@features/financial-profile/models';
import { assessExchangeRisk } from './exchange-risk.function';

describe('assessExchangeRisk', () => {
  const rates: ExchangeRates = { base: 'USD', unitsPerBase: { USD: 1, HNL: 25 }, date: '2026-11-18' };
  const salary: Income = {
    id: 'salary',
    createdAt: 1,
    type: 'salary',
    description: '',
    currency: 'HNL',
    monthlyAmount: 25000,
    monthlyCosts: 0
  };
  const remittance: Income = { ...salary, id: 'remittance', type: 'other', currency: 'USD', monthlyAmount: 1000 };

  it('has no risk when every income is in the loan currency', () => {
    expect(assessExchangeRisk({ incomes: [salary], loanCurrency: 'HNL', monthlyPayment: 5000, rates, stressPercent: 10 })).toBeNull();
  });

  it('measures the payment in the income currency and with a stronger loan currency', () => {
    const risk = assessExchangeRisk({ incomes: [salary, remittance], loanCurrency: 'USD', monthlyPayment: 500, rates, stressPercent: 10 });

    expect(risk?.incomeCurrency).toBe('HNL');
    expect(risk?.foreignIncomePercent).toBe(50);
    expect(risk?.paymentInIncomeCurrency).toBe(12500);
    expect(risk?.stressedPayment).toBe(13750);
  });

  it('ignores incomes that do not add money', () => {
    const business: Income = { ...salary, id: 'business', type: 'business', monthlyAmount: 1000, monthlyCosts: 1000 };

    expect(assessExchangeRisk({ incomes: [remittance, business], loanCurrency: 'USD', monthlyPayment: 500, rates, stressPercent: 10 })).toBeNull();
  });
});
