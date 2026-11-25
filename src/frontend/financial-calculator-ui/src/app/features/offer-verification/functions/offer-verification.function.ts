import { addMonthsToIsoDate } from '@core/functions/date.function';
import { summarizeLoanCost } from '@features/loan-analysis/functions/loan-cost.function';
import { summarizePaymentsByYear } from '@features/loan-analysis/functions/yearly-payments.function';
import { VerificationSummary } from '../interfaces/verification-summary.interface';
import { OfferVerification } from '../models';
import { checkQuotedPayment } from './quote-check.function';
import { toAmortizationOptions, toLoanOffer } from './verification-factory.function';

export function buildDueDates(firstPaymentDate: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => addMonthsToIsoDate(firstPaymentDate, index));
}

export function summarizeOfferVerification(verification: OfferVerification): VerificationSummary {
  const cost = summarizeLoanCost(toLoanOffer(verification), toAmortizationOptions(verification));
  return {
    currency: verification.currency,
    cost,
    yearlyPayments: summarizePaymentsByYear(cost.schedule),
    dueDates: buildDueDates(verification.firstPaymentDate, cost.schedule.length),
    quote: checkQuotedPayment(verification, cost),
    paidOffEarly: cost.schedule.length < verification.termMonths
  };
}
