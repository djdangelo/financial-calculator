import { isIsoDate } from '@core/functions/date.function';
import { isAnnualRateValid, isLoanOfferValid } from '@features/loan-offers/functions/offer-validation.function';
import {
  MAX_BALANCE_INSURANCE_PERCENT,
  MIN_GRACE_MONTHS,
  MIN_RATE_CHANGE_MONTH
} from '../constants/offer-verification.constant';
import { OfferVerification } from '../models';
import { hasRateChange, toLoanOffer } from './verification-factory.function';

export function isGraceValid(graceMonths: number, termMonths: number): boolean {
  return Number.isInteger(graceMonths) && graceMonths >= MIN_GRACE_MONTHS && graceMonths < termMonths;
}

export function isRateChangeValid(verification: OfferVerification): boolean {
  if (!hasRateChange(verification)) {
    return verification.rateChangeAnnualRatePercent === 0;
  }
  return Number.isInteger(verification.rateChangeMonth)
    && verification.rateChangeMonth >= MIN_RATE_CHANGE_MONTH
    && verification.rateChangeMonth <= verification.termMonths
    && isAnnualRateValid(verification.rateChangeAnnualRatePercent);
}

export function isBalanceInsuranceValid(ratePercent: number): boolean {
  return ratePercent >= 0 && ratePercent <= MAX_BALANCE_INSURANCE_PERCENT;
}

export function isOfferVerificationValid(verification: OfferVerification): boolean {
  return isLoanOfferValid(toLoanOffer(verification))
    && isIsoDate(verification.firstPaymentDate)
    && isGraceValid(verification.graceMonths, verification.termMonths)
    && isRateChangeValid(verification)
    && isBalanceInsuranceValid(verification.balanceInsuranceRatePercent)
    && verification.extraMonthlyPayment >= 0
    && verification.quotedPayment >= 0;
}
