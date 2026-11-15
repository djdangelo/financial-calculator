import { roundMoney, sumAmounts } from '@core/functions/finance.function';
import { LoanOffer } from '@features/loan-offers/models';
import { LoanCostSummary } from '../interfaces/loan-cost-summary.interface';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { buildAmortizationSchedule } from './amortization.function';
import {
  calculateDisbursementFee,
  calculateFinancedPrincipal,
  calculateNetDisbursement
} from './disbursement.function';
import { calculateEffectiveAnnualCostPercent } from './effective-annual-cost.function';
import { calculateLevelPayment } from './level-payment.function';

export function resolveLoanTerms(offer: LoanOffer): LoanTerms {
  return {
    principal: calculateFinancedPrincipal(offer),
    annualRatePercent: offer.annualRatePercent,
    termMonths: offer.termMonths
  };
}

export function summarizeLoanCost(offer: LoanOffer): LoanCostSummary {
  const terms = resolveLoanTerms(offer);
  const schedule = buildAmortizationSchedule(terms, offer.monthlyInsurance);
  const levelPayment = calculateLevelPayment(terms);
  const netDisbursement = calculateNetDisbursement(offer);
  const totalPayments = schedule.map(row => row.totalPayment);
  const totalPaid = roundMoney(sumAmounts(totalPayments));

  return {
    disbursementFee: calculateDisbursementFee(offer),
    financedPrincipal: terms.principal,
    netDisbursement,
    levelPayment,
    monthlyPayment: roundMoney(levelPayment + offer.monthlyInsurance),
    totalInterest: roundMoney(sumAmounts(schedule.map(row => row.interest))),
    totalInsurance: roundMoney(sumAmounts(schedule.map(row => row.insurance))),
    totalPaid,
    totalCost: roundMoney(totalPaid - netDisbursement),
    effectiveAnnualCostPercent: calculateEffectiveAnnualCostPercent(netDisbursement, totalPayments),
    schedule
  };
}
