import { DEFAULT_BURDEN_LIMITS } from '@core/constants/market.constant';
import { LoanOffer } from '@features/loan-offers/models';
import { LoanAnalysisInput } from '../interfaces/loan-analysis-input.interface';
import { analyzeLoan } from './loan-analysis.function';
import {
  calculateMaxLoanAmount,
  calculateMaxMonthlyPayment,
  calculatePrincipalForPayment
} from './max-loan-amount.function';

describe('max loan amount functions', () => {
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

  it('takes the tighter of the two limits as the maximum payment', () => {
    expect(calculateMaxMonthlyPayment(input, DEFAULT_BURDEN_LIMITS)).toBe(10000);
    expect(calculateMaxMonthlyPayment({ ...input, expenses: 15000 }, DEFAULT_BURDEN_LIMITS)).toBe(7000);
  });

  it('never returns a negative payment', () => {
    expect(calculateMaxMonthlyPayment({ ...input, expenses: 30000 }, DEFAULT_BURDEN_LIMITS)).toBe(0);
  });

  it('finds the principal that a level payment can cover', () => {
    expect(calculatePrincipalForPayment(9950, { annualRatePercent: 24, termMonths: 12 })).toBe(105224.65);
    expect(calculatePrincipalForPayment(1000, { annualRatePercent: 0, termMonths: 12 })).toBe(12000);
    expect(calculatePrincipalForPayment(0, { annualRatePercent: 24, termMonths: 12 })).toBe(0);
  });

  it('leaves room for the insurance in the maximum amount', () => {
    const max = calculateMaxLoanAmount(input);

    expect(max.maxPayment).toBe(10000);
    expect(max.maxAmount).toBe(105224.65);
    expect(max.exceedsMax).toBeFalse();
  });

  it('discounts a financed fee from the maximum amount', () => {
    expect(calculateMaxLoanAmount({ ...input, offer: { ...offer, feeMode: 'financed' } }).maxAmount).toBe(103161.42);
  });

  it('keeps the verdict within the limits when the maximum amount is requested', () => {
    const max = calculateMaxLoanAmount(input);
    const analysis = analyzeLoan({ ...input, offer: { ...offer, amount: max.maxAmount } });

    expect(analysis.budget.newLoanPayment).toBeLessThanOrEqual(max.maxPayment);
    expect(analysis.verdict).toBe('can-take');
  });

  it('flags a requested amount above the maximum', () => {
    expect(calculateMaxLoanAmount({ ...input, offer: { ...offer, amount: 120000 } }).exceedsMax).toBeTrue();
  });
});
