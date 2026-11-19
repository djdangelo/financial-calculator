import { MONTHS_PER_YEAR } from '@core/constants/finance.constant';
import { roundMoney } from '@core/functions/finance.function';
import { AmortizationRow } from '../interfaces/amortization-row.interface';
import { YearlyPaymentSummary } from '../interfaces/yearly-payment-summary.interface';

export function summarizePaymentsByYear(schedule: readonly AmortizationRow[]): YearlyPaymentSummary[] {
  const years = new Map<number, YearlyPaymentSummary>();
  for (const row of schedule) {
    const year = Math.ceil(row.period / MONTHS_PER_YEAR);
    const current = years.get(year) ?? { year, principal: 0, interest: 0, insurance: 0 };
    years.set(year, {
      year,
      principal: current.principal + row.principal,
      interest: current.interest + row.interest,
      insurance: current.insurance + row.insurance
    });
  }

  return [...years.values()].map(summary => ({
    year: summary.year,
    principal: roundMoney(summary.principal),
    interest: roundMoney(summary.interest),
    insurance: roundMoney(summary.insurance)
  }));
}
