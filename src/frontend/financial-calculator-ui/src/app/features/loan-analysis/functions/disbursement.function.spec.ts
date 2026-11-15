import { LoanOffer } from '@features/loan-offers/models';
import {
  calculateDisbursementFee,
  calculateFinancedPrincipal,
  calculateNetDisbursement
} from './disbursement.function';

describe('disbursement functions', () => {
  const offer: LoanOffer = {
    id: 'offer',
    bankName: 'Banco',
    currency: 'HNL',
    amount: 100000,
    annualRatePercent: 24,
    termMonths: 12,
    disbursementFeePercent: 2,
    feeMode: 'deducted',
    monthlyInsurance: 0,
    otherInitialCharges: 0
  };

  it('calculates the fee over the requested amount', () => {
    expect(calculateDisbursementFee(offer)).toBe(2000);
  });

  it('deducts the fee from the money received', () => {
    expect(calculateFinancedPrincipal(offer)).toBe(100000);
    expect(calculateNetDisbursement(offer)).toBe(98000);
  });

  it('adds the fee to the principal when it is financed', () => {
    const financed: LoanOffer = { ...offer, feeMode: 'financed' };
    expect(calculateFinancedPrincipal(financed)).toBe(102000);
    expect(calculateNetDisbursement(financed)).toBe(100000);
  });

  it('deducts the other initial charges in both modes', () => {
    expect(calculateNetDisbursement({ ...offer, otherInitialCharges: 500 })).toBe(97500);
    expect(calculateNetDisbursement({ ...offer, feeMode: 'financed', otherInitialCharges: 500 })).toBe(99500);
  });
});
