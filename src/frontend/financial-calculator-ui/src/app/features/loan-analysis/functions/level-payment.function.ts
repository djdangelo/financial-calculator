import { monthlyRateFromAnnualPercent, roundMoney } from '@core/functions/finance.function';
import { LoanTerms } from '../interfaces/loan-terms.interface';

export function calculateLevelPayment({ principal, annualRatePercent, termMonths }: LoanTerms): number {
  if (principal <= 0 || termMonths <= 0) {
    return 0;
  }

  const monthlyRate = monthlyRateFromAnnualPercent(annualRatePercent);
  if (monthlyRate === 0) {
    return roundMoney(principal / termMonths);
  }

  return roundMoney(principal * monthlyRate / (1 - (1 + monthlyRate) ** -termMonths));
}
