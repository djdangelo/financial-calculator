import { CurrencyCode } from '@core/@types/currency-code.type';
import { addMonthsToIsoDate } from '@core/functions/date.function';
import { AmortizationOptions } from '@features/loan-analysis/interfaces/amortization-options.interface';
import { DEFAULT_FEE_MODE } from '@features/loan-offers/constants/loan-offers.constant';
import { LoanOffer } from '@features/loan-offers/models';
import { FIRST_PAYMENT_MONTHS_AHEAD, OFFER_VERIFICATION_ID } from '../constants/offer-verification.constant';
import { OfferVerification } from '../models';

export function createOfferVerification(currency: CurrencyCode, today: string): OfferVerification {
  return {
    id: OFFER_VERIFICATION_ID,
    createdAt: Date.now(),
    bankName: '',
    currency,
    amount: 0,
    annualRatePercent: 0,
    termMonths: 0,
    disbursementFeePercent: 0,
    feeMode: DEFAULT_FEE_MODE,
    monthlyInsurance: 0,
    otherInitialCharges: 0,
    firstPaymentDate: addMonthsToIsoDate(today, FIRST_PAYMENT_MONTHS_AHEAD),
    quotedPayment: 0,
    balanceInsuranceRatePercent: 0,
    graceMonths: 0,
    rateChangeMonth: 0,
    rateChangeAnnualRatePercent: 0,
    extraMonthlyPayment: 0
  };
}

export function toLoanOffer(verification: OfferVerification): LoanOffer {
  return {
    id: verification.id,
    createdAt: verification.createdAt,
    bankName: verification.bankName,
    currency: verification.currency,
    amount: verification.amount,
    annualRatePercent: verification.annualRatePercent,
    termMonths: verification.termMonths,
    disbursementFeePercent: verification.disbursementFeePercent,
    feeMode: verification.feeMode,
    monthlyInsurance: verification.monthlyInsurance,
    otherInitialCharges: verification.otherInitialCharges,
    consolidatedDebtIds: []
  };
}

export function applyLoanOffer(verification: OfferVerification, offer: LoanOffer): OfferVerification {
  return {
    ...verification,
    bankName: offer.bankName,
    currency: offer.currency,
    amount: offer.amount,
    annualRatePercent: offer.annualRatePercent,
    termMonths: offer.termMonths,
    disbursementFeePercent: offer.disbursementFeePercent,
    feeMode: offer.feeMode,
    monthlyInsurance: offer.monthlyInsurance,
    otherInitialCharges: offer.otherInitialCharges
  };
}

export function hasRateChange(verification: OfferVerification): boolean {
  return verification.rateChangeMonth > 0;
}

export function toAmortizationOptions(verification: OfferVerification): Omit<AmortizationOptions, 'monthlyInsurance'> {
  return {
    balanceInsuranceRatePercent: verification.balanceInsuranceRatePercent,
    graceMonths: verification.graceMonths,
    rateChange: hasRateChange(verification)
      ? { fromPeriod: verification.rateChangeMonth, annualRatePercent: verification.rateChangeAnnualRatePercent }
      : null,
    extraMonthlyPayment: verification.extraMonthlyPayment
  };
}

export function hasSpecialConditions(verification: OfferVerification): boolean {
  return verification.balanceInsuranceRatePercent > 0
    || verification.graceMonths > 0
    || hasRateChange(verification)
    || verification.extraMonthlyPayment > 0;
}
