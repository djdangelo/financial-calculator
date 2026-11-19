import { ExchangeRates } from '@core/interfaces/exchange-rates.interface';
import { Debt } from '@features/financial-profile/models';
import { DebtConsolidationInput } from '../interfaces/debt-consolidation-input.interface';
import { LoanCostSummary } from '../interfaces/loan-cost-summary.interface';
import {
  analyzeDebtConsolidation,
  estimateRemainingDebtCost,
  estimateRemainingDebtsCost,
  estimateRemainingMonths,
  resolveConsolidationIssues
} from './debt-consolidation.function';

describe('debt consolidation functions', () => {
  const rates: ExchangeRates = { base: 'USD', unitsPerBase: { USD: 1, HNL: 25 }, date: '2026-11-18' };
  const card: Debt = {
    id: 'card',
    createdAt: 1,
    type: 'credit-card',
    description: '',
    currency: 'HNL',
    monthlyPayment: 1800,
    balance: 30000,
    annualRatePercent: 48,
    remainingMonths: null
  };
  const car: Debt = {
    ...card,
    id: 'car',
    type: 'vehicle',
    monthlyPayment: 1000,
    balance: 15000,
    annualRatePercent: null,
    remainingMonths: 20
  };
  const cost: LoanCostSummary = {
    disbursementFee: 0,
    financedPrincipal: 50000,
    netDisbursement: 50000,
    levelPayment: 2000,
    monthlyInsurance: 0,
    monthlyPayment: 2000,
    totalInterest: 22000,
    totalInsurance: 0,
    totalPaid: 72000,
    totalCost: 22000,
    effectiveAnnualCostPercent: 0,
    schedule: []
  };
  const input: DebtConsolidationInput = { debts: [card, car], currency: 'HNL', rates, cost, verdict: 'can-take' };

  describe('estimateRemainingMonths', () => {
    it('uses the remaining months when the person knows them', () => {
      expect(estimateRemainingMonths(car)).toBe(20);
    });

    it('estimates the months from the rate, the balance and the payment', () => {
      expect(estimateRemainingMonths(card)).toBeCloseTo(28.011, 3);
    });

    it('divides the balance by the payment when the rate is zero', () => {
      expect(estimateRemainingMonths({ ...card, annualRatePercent: 0 })).toBe(30000 / 1800);
    });

    it('cannot estimate without rate nor months', () => {
      expect(estimateRemainingMonths({ ...card, annualRatePercent: null })).toBeNull();
    });

    it('cannot estimate when the payment does not cover the interest', () => {
      expect(estimateRemainingMonths({ ...card, monthlyPayment: 1200 })).toBeNull();
    });
  });

  describe('estimateRemainingDebtCost', () => {
    it('multiplies the payment by the remaining months', () => {
      expect(estimateRemainingDebtCost(car)).toBe(20000);
      expect(estimateRemainingDebtCost(card)).toBe(50419.84);
    });

    it('adds the debts in the analysis currency', () => {
      const dollarDebt: Debt = { ...car, currency: 'USD', monthlyPayment: 100, remainingMonths: 10 };

      expect(estimateRemainingDebtsCost([car, dollarDebt], 'HNL', rates)).toBe(45000);
    });

    it('returns null when one debt cannot be estimated', () => {
      expect(estimateRemainingDebtsCost([car, { ...card, annualRatePercent: null }], 'HNL', rates)).toBeNull();
    });
  });

  describe('resolveConsolidationIssues', () => {
    it('has no issues when every condition is met', () => {
      expect(resolveConsolidationIssues(5000, 800, 'can-take')).toEqual([]);
    });

    it('lists every condition that is not met', () => {
      expect(resolveConsolidationIssues(-1, 0, 'caution')).toEqual(['insufficient-amount', 'higher-payment', 'over-limits']);
    });
  });

  describe('analyzeDebtConsolidation', () => {
    it('compares the debts against the new loan', () => {
      const consolidation = analyzeDebtConsolidation(input);

      expect(consolidation.debtCount).toBe(2);
      expect(consolidation.coveredBalance).toBe(45000);
      expect(consolidation.cashLeft).toBe(5000);
      expect(consolidation.replacedPayments).toBe(2800);
      expect(consolidation.newPayment).toBe(2000);
      expect(consolidation.monthlySavings).toBe(800);
      expect(consolidation.currentRemainingCost).toBe(70419.84);
      expect(consolidation.consolidatedTotalCost).toBe(67000);
      expect(consolidation.extraTotalCost).toBe(-3419.84);
      expect(consolidation.recommended).toBeTrue();
    });

    it('warns when the new loan costs more in total', () => {
      const consolidation = analyzeDebtConsolidation({ ...input, cost: { ...cost, totalPaid: 90000 } });

      expect(consolidation.extraTotalCost).toBe(14580.16);
      expect(consolidation.recommended).toBeTrue();
    });

    it('does not recommend it when the amount does not cover the debts', () => {
      const consolidation = analyzeDebtConsolidation({ ...input, cost: { ...cost, netDisbursement: 40000 } });

      expect(consolidation.cashLeft).toBe(-5000);
      expect(consolidation.issues).toEqual(['insufficient-amount']);
      expect(consolidation.recommended).toBeFalse();
    });

    it('converts debts in another currency', () => {
      const dollarCard: Debt = { ...car, currency: 'USD', balance: 1000, monthlyPayment: 100 };
      const consolidation = analyzeDebtConsolidation({ ...input, debts: [dollarCard] });

      expect(consolidation.coveredBalance).toBe(25000);
      expect(consolidation.replacedPayments).toBe(2500);
    });

    it('leaves the total cost unknown when a debt cannot be estimated', () => {
      const consolidation = analyzeDebtConsolidation({ ...input, debts: [{ ...card, annualRatePercent: null }] });

      expect(consolidation.currentRemainingCost).toBeNull();
      expect(consolidation.extraTotalCost).toBeNull();
    });
  });
});
