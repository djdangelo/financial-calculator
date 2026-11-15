import { percentToRatio, roundMoney } from '@core/functions/finance.function';
import { LoanOffer } from '@features/loan-offers/models';

export function calculateDisbursementFee(offer: LoanOffer): number {
  return roundMoney(offer.amount * percentToRatio(offer.disbursementFeePercent));
}

export function calculateFinancedPrincipal(offer: LoanOffer): number {
  const financedFee = offer.feeMode === 'financed' ? calculateDisbursementFee(offer) : 0;
  return roundMoney(offer.amount + financedFee);
}

export function calculateNetDisbursement(offer: LoanOffer): number {
  const deductedFee = offer.feeMode === 'deducted' ? calculateDisbursementFee(offer) : 0;
  return roundMoney(offer.amount - deductedFee - offer.otherInitialCharges);
}
