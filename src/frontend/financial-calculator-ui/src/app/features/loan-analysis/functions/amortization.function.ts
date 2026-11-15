import { monthlyRateFromAnnualPercent, roundMoney } from '@core/functions/finance.function';
import { AmortizationRow } from '../interfaces/amortization-row.interface';
import { LoanTerms } from '../interfaces/loan-terms.interface';
import { calculateLevelPayment } from './level-payment.function';

export function buildAmortizationSchedule(terms: LoanTerms, monthlyInsurance = 0): AmortizationRow[] {
  const levelPayment = calculateLevelPayment(terms);
  const monthlyRate = monthlyRateFromAnnualPercent(terms.annualRatePercent);
  const rows: AmortizationRow[] = [];
  let balance = levelPayment > 0 ? terms.principal : 0;

  for (let period = 1; period <= terms.termMonths && balance > 0; period++) {
    const interest = roundMoney(balance * monthlyRate);
    const isLastPeriod = period === terms.termMonths;
    const principal = isLastPeriod ? balance : Math.min(balance, roundMoney(levelPayment - interest));
    balance = roundMoney(balance - principal);
    rows.push(buildAmortizationRow(period, principal, interest, monthlyInsurance, balance));
  }

  return rows;
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
