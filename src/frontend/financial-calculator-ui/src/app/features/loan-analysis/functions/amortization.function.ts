import { monthlyRateFromAnnualPercent, percentToRatio, roundMoney } from '@core/functions/finance.function';
import { DEFAULT_AMORTIZATION_OPTIONS } from '../constants/loan-analysis.constant';
import { AmortizationOptions } from '../interfaces/amortization-options.interface';
import { AmortizationRow } from '../interfaces/amortization-row.interface';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { RateChange } from '../interfaces/rate-change.interface';
import { calculateLevelPayment } from './level-payment.function';

export function resolveAmortizationOptions(options: Partial<AmortizationOptions> = {}): AmortizationOptions {
  return { ...DEFAULT_AMORTIZATION_OPTIONS, ...options };
}

export function resolveAnnualRateForPeriod(terms: LoanTerms, rateChange: RateChange | null, period: number): number {
  return rateChange !== null && period >= rateChange.fromPeriod ? rateChange.annualRatePercent : terms.annualRatePercent;
}

export function calculateRegularPayment(terms: LoanTerms, options: Partial<AmortizationOptions> = {}): number {
  const { graceMonths, rateChange } = resolveAmortizationOptions(options);
  const firstPeriod = graceMonths + 1;
  return calculateLevelPayment({
    principal: terms.principal,
    annualRatePercent: resolveAnnualRateForPeriod(terms, rateChange, firstPeriod),
    termMonths: terms.termMonths - graceMonths
  });
}

export function buildAmortizationSchedule(terms: LoanTerms, options: Partial<AmortizationOptions> = {}): AmortizationRow[] {
  const settings = resolveAmortizationOptions(options);
  const rows: AmortizationRow[] = [];
  let levelPayment = calculateRegularPayment(terms, settings);
  let balance = levelPayment > 0 ? terms.principal : 0;

  for (let period = 1; period <= terms.termMonths && balance > 0; period++) {
    const annualRatePercent = resolveAnnualRateForPeriod(terms, settings.rateChange, period);
    if (period > settings.graceMonths + 1 && settings.rateChange?.fromPeriod === period) {
      levelPayment = calculateLevelPayment({ principal: balance, annualRatePercent, termMonths: terms.termMonths - period + 1 });
    }
    const interest = roundMoney(balance * monthlyRateFromAnnualPercent(annualRatePercent));
    const insurance = roundMoney(settings.monthlyInsurance + balance * percentToRatio(settings.balanceInsuranceRatePercent));
    const principal = resolvePrincipal(period, balance, levelPayment - interest, terms, settings);
    balance = roundMoney(balance - principal);
    rows.push(buildAmortizationRow(period, principal, interest, insurance, balance));
  }

  return rows;
}

function resolvePrincipal(
  period: number,
  balance: number,
  scheduledPrincipal: number,
  terms: LoanTerms,
  settings: AmortizationOptions
): number {
  if (period <= settings.graceMonths) {
    return 0;
  }
  if (period === terms.termMonths) {
    return balance;
  }
  return Math.min(balance, roundMoney(scheduledPrincipal + settings.extraMonthlyPayment));
}

function buildAmortizationRow(
  period: number,
  principal: number,
  interest: number,
  insurance: number,
  balance: number
): AmortizationRow {
  const payment = roundMoney(principal + interest);
  return { period, payment, interest, principal, insurance, totalPayment: roundMoney(payment + insurance), balance };
}
