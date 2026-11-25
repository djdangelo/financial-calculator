import { LoanOffer } from '@features/loan-offers/models';
import { summarizeLoanCost } from './loan-cost.function';

describe('summarizeLoanCost', () => {
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

  it('summarizes an offer with the fee deducted', () => {
    const summary = summarizeLoanCost(offer);

    expect(summary.disbursementFee).toBe(2000);
    expect(summary.financedPrincipal).toBe(100000);
    expect(summary.netDisbursement).toBe(98000);
    expect(summary.levelPayment).toBe(9455.96);
    expect(summary.monthlyPayment).toBe(9505.96);
    expect(summary.totalInsurance).toBe(600);
    expect(summary.totalInterest).toBeCloseTo(13471.52, 0);
    expect(summary.schedule.length).toBe(12);
  });

  it('adds interest, insurance and fee into the total cost', () => {
    const summary = summarizeLoanCost(offer);

    expect(summary.totalPaid).toBeCloseTo(100000 + summary.totalInterest + summary.totalInsurance, 2);
    expect(summary.totalCost).toBeCloseTo(summary.totalInterest + summary.totalInsurance + summary.disbursementFee, 2);
  });

  it('reports an effective cost above the contract rate', () => {
    const withoutCharges = summarizeLoanCost({ ...offer, disbursementFeePercent: 0, monthlyInsurance: 0 });
    const withCharges = summarizeLoanCost(offer);

    expect(withoutCharges.effectiveAnnualCostPercent).toBeCloseTo(26.82, 1);
    expect(withCharges.effectiveAnnualCostPercent).toBeGreaterThan(withoutCharges.effectiveAnnualCostPercent);
  });

  it('charges interest on the fee when it is financed', () => {
    const financed = summarizeLoanCost({ ...offer, feeMode: 'financed' });
    const deducted = summarizeLoanCost(offer);

    expect(financed.financedPrincipal).toBe(102000);
    expect(financed.netDisbursement).toBe(100000);
    expect(financed.levelPayment).toBeGreaterThan(deducted.levelPayment);
    expect(financed.totalInterest).toBeGreaterThan(deducted.totalInterest);
  });

  it('reports the payment due after the grace months', () => {
    const summary = summarizeLoanCost(offer, { graceMonths: 2 });

    expect(summary.schedule[0].payment).toBe(2000);
    expect(summary.levelPayment).toBe(summary.schedule[2].payment);
    expect(summary.monthlyPayment).toBe(summary.schedule[2].totalPayment);
  });

  it('uses the insurance of the first regular payment when it depends on the balance', () => {
    const summary = summarizeLoanCost({ ...offer, monthlyInsurance: 0 }, { balanceInsuranceRatePercent: 0.1 });

    expect(summary.monthlyInsurance).toBe(100);
    expect(summary.monthlyPayment).toBe(9555.96);
    expect(summary.totalInsurance).toBeLessThan(1200);
  });
});
