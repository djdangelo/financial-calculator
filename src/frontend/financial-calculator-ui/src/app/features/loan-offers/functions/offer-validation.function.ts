import {
  MAX_ANNUAL_RATE_PERCENT,
  MAX_FEE_PERCENT,
  MAX_TERM_MONTHS,
  MIN_MONEY_AMOUNT,
  MIN_TERM_MONTHS
} from '@core/constants/finance.constant';
import { calculateNetDisbursement } from '@features/loan-analysis/functions/disbursement.function';
import { LoanOffer } from '../models';

export function isAnnualRateValid(annualRatePercent: number): boolean {
  return annualRatePercent > 0 && annualRatePercent <= MAX_ANNUAL_RATE_PERCENT;
}

export function isTermValid(termMonths: number): boolean {
  return Number.isInteger(termMonths) && termMonths >= MIN_TERM_MONTHS && termMonths <= MAX_TERM_MONTHS;
}

export function hasPositiveDisbursement(offer: LoanOffer): boolean {
  return calculateNetDisbursement(offer) >= MIN_MONEY_AMOUNT;
}

export function isLoanOfferValid(offer: LoanOffer): boolean {
  return offer.amount >= MIN_MONEY_AMOUNT
    && isAnnualRateValid(offer.annualRatePercent)
    && isTermValid(offer.termMonths)
    && offer.disbursementFeePercent >= 0
    && offer.disbursementFeePercent <= MAX_FEE_PERCENT
    && offer.monthlyInsurance >= 0
    && offer.otherInitialCharges >= 0
    && hasPositiveDisbursement(offer);
}
