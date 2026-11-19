import { DEFAULT_BURDEN_LIMITS } from '@core/constants/market.constant';
import { LoanOffer } from '@features/loan-offers/models';
import { LoanAnalysisInput } from '../interfaces/loan-analysis-input.interface';
import { analyzeLoan, calculateAvailableAfterLoan } from './loan-analysis.function';

describe('loan analysis functions', () => {
  const offer: LoanOffer = {
    id: 'offer',
    createdAt: 1,
    bankName: 'Banco',
    currency: 'HNL',
    amount: 100000,
    annualRatePercent: 24,
    termMonths: 12,
    disbursementFeePercent: 2,
    feeMode: 'deducted',
    monthlyInsurance: 50,
    otherInitialCharges: 0,
    consolidatedDebtIds: []
  };
  const input: LoanAnalysisInput = {
    offer,
    netIncome: 30000,
    expenses: 10000,
    currentDebtPayments: 2000,
    limits: DEFAULT_BURDEN_LIMITS
  };

  it('adds the new payment with insurance to the budget', () => {
    const analysis = analyzeLoan(input);

    expect(analysis.currency).toBe('HNL');
    expect(analysis.budget.newLoanPayment).toBe(9505.96);
    expect(analysis.availableAfterLoan).toBe(8494.04);
  });

  it('can take the loan when both limits are met', () => {
    const analysis = analyzeLoan(input);

    expect(analysis.indicators.totalBurdenPercent).toBeCloseTo(71.69, 2);
    expect(analysis.indicators.debtBurdenPercent).toBeCloseTo(38.35, 2);
    expect(analysis.verdict).toBe('can-take');
  });

  it('asks for caution when only the debt limit is exceeded', () => {
    const analysis = analyzeLoan({ ...input, currentDebtPayments: 4000 });

    expect(analysis.indicators.debtBurdenPercent).toBeCloseTo(45.02, 2);
    expect(analysis.verdict).toBe('caution');
  });

  it('does not recommend the loan when the total limit is exceeded', () => {
    const analysis = analyzeLoan({ ...input, expenses: 13000, currentDebtPayments: 4000 });

    expect(analysis.indicators.totalBurdenPercent).toBeCloseTo(88.35, 2);
    expect(analysis.verdict).toBe('not-recommended');
  });

  it('uses the limits chosen by the person', () => {
    const analysis = analyzeLoan({ ...input, limits: { totalBurdenPercent: 70, debtBurdenPercent: 40 } });

    expect(analysis.verdict).toBe('not-recommended');
  });

  it('reports a negative balance when the payments exceed the income', () => {
    expect(calculateAvailableAfterLoan({ netIncome: 1000, expenses: 800, currentDebtPayments: 300, newLoanPayment: 100 }))
      .toBe(-200);
  });
});
