import { roundMoney, sumAmounts } from '@core/functions/finance.function';
import { LoanOffer } from '@features/loan-offers/models';
import { AmortizationOptions } from '../interfaces/amortization-options.interface';
import { LoanCostSummary } from '../interfaces/loan-cost-summary.interface';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { buildAmortizationSchedule, calculateRegularPayment, resolveAmortizationOptions } from './amortization.function';
import {
  calculateDisbursementFee,
  calculateFinancedPrincipal,
  calculateNetDisbursement
} from './disbursement.function';
import { calculateEffectiveAnnualCostPercent } from './effective-annual-cost.function';

export function resolveLoanTerms(offer: LoanOffer): LoanTerms {
  return {
    principal: calculateFinancedPrincipal(offer),
    annualRatePercent: offer.annualRatePercent,
    termMonths: offer.termMonths
  };
}

export function summarizeLoanCost(
  offer: LoanOffer,
  extraOptions: Partial<Omit<AmortizationOptions, 'monthlyInsurance'>> = {}
): LoanCostSummary {
  const terms = resolveLoanTerms(offer);
  const options = resolveAmortizationOptions({ ...extraOptions, monthlyInsurance: offer.monthlyInsurance });
  const schedule = buildAmortizationSchedule(terms, options);
  const levelPayment = calculateRegularPayment(terms, options);
  const monthlyInsurance = schedule[options.graceMonths]?.insurance ?? offer.monthlyInsurance;
  const netDisbursement = calculateNetDisbursement(offer);
  const totalPayments = schedule.map(row => row.totalPayment);
  const totalPaid = roundMoney(sumAmounts(totalPayments));

  return {
    disbursementFee: calculateDisbursementFee(offer),
    financedPrincipal: terms.principal,
    netDisbursement,
    levelPayment,
    monthlyInsurance,
    monthlyPayment: roundMoney(levelPayment + monthlyInsurance),
    totalInterest: roundMoney(sumAmounts(schedule.map(row => row.interest))),
    totalInsurance: roundMoney(sumAmounts(schedule.map(row => row.insurance))),
    totalPaid,
    totalCost: roundMoney(totalPaid - netDisbursement),
    effectiveAnnualCostPercent: calculateEffectiveAnnualCostPercent(netDisbursement, totalPayments),
    schedule
  };
}
