import { MAX_ANNUAL_RATE_PERCENT } from '@core/constants/finance.constant';
import { roundMoney } from '@core/functions/finance.function';
import { calculateLevelPayment } from '@features/loan-analysis/functions/level-payment.function';
import { LoanCostSummary } from '@features/loan-analysis/interfaces/loan-cost-summary.interface';
import { QuoteStatus } from '../@types/quote-status.type';
import {
  QUOTE_TOLERANCE,
  RATE_SEARCH_MAX_ITERATIONS,
  RATE_SEARCH_TOLERANCE
} from '../constants/offer-verification.constant';
import { QuoteCheck } from '../interfaces/quote-check.interface';
import { OfferVerification } from '../models';

export function findAnnualRateForPayment(principal: number, termMonths: number, payment: number): number | null {
  const paymentAt = (annualRatePercent: number) => calculateLevelPayment({ principal, annualRatePercent, termMonths });
  if (principal <= 0 || termMonths <= 0 || payment < paymentAt(0) || payment > paymentAt(MAX_ANNUAL_RATE_PERCENT)) {
    return null;
  }

  let lowRate = 0;
  let highRate = MAX_ANNUAL_RATE_PERCENT;
  for (let iteration = 0; iteration < RATE_SEARCH_MAX_ITERATIONS && highRate - lowRate > RATE_SEARCH_TOLERANCE; iteration++) {
    const middleRate = (lowRate + highRate) / 2;
    if (paymentAt(middleRate) < payment) {
      lowRate = middleRate;
    } else {
      highRate = middleRate;
    }
  }

  return (lowRate + highRate) / 2;
}

export function resolveQuoteStatus(difference: number): QuoteStatus {
  if (Math.abs(difference) <= QUOTE_TOLERANCE) {
    return 'matches';
  }
  return difference > 0 ? 'higher' : 'lower';
}

export function checkQuotedPayment(verification: OfferVerification, cost: LoanCostSummary): QuoteCheck | null {
  if (verification.quotedPayment <= 0) {
    return null;
  }

  const regularMonths = verification.termMonths - verification.graceMonths;
  const difference = roundMoney(verification.quotedPayment - cost.monthlyPayment);
  const status = resolveQuoteStatus(difference);
  const impliedAnnualRatePercent = status === 'matches'
    ? null
    : findAnnualRateForPayment(cost.financedPrincipal, regularMonths, verification.quotedPayment - cost.monthlyInsurance);

  return {
    quotedPayment: verification.quotedPayment,
    calculatedPayment: cost.monthlyPayment,
    difference,
    differenceOverTerm: roundMoney(difference * regularMonths),
    status,
    impliedAnnualRatePercent
  };
}
