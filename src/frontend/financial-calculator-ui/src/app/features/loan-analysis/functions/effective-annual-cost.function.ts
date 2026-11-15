import { MONTHS_PER_YEAR } from '@core/constants/finance.constant';
import { ratioToPercent, sumAmounts } from '@core/functions/finance.function';
import {
  INTERNAL_RATE_MAX_ITERATIONS,
  INTERNAL_RATE_MAX_MONTHLY,
  INTERNAL_RATE_TOLERANCE
} from '../constants/loan-analysis.constant';

export function calculatePresentValue(monthlyPayments: readonly number[], monthlyRate: number): number {
  return monthlyPayments.reduce(
    (total, payment, index) => total + payment / (1 + monthlyRate) ** (index + 1),
    0
  );
}

export function calculateMonthlyInternalRate(netDisbursement: number, monthlyPayments: readonly number[]): number {
  if (netDisbursement <= 0 || sumAmounts(monthlyPayments) <= netDisbursement) {
    return 0;
  }

  let lowRate = 0;
  let highRate = INTERNAL_RATE_MAX_MONTHLY;
  for (let iteration = 0; iteration < INTERNAL_RATE_MAX_ITERATIONS && highRate - lowRate > INTERNAL_RATE_TOLERANCE; iteration++) {
    const middleRate = (lowRate + highRate) / 2;
    if (calculatePresentValue(monthlyPayments, middleRate) > netDisbursement) {
      lowRate = middleRate;
    } else {
      highRate = middleRate;
    }
  }

  return (lowRate + highRate) / 2;
}

export function calculateEffectiveAnnualCostPercent(netDisbursement: number, monthlyPayments: readonly number[]): number {
  const monthlyRate = calculateMonthlyInternalRate(netDisbursement, monthlyPayments);
  return ratioToPercent((1 + monthlyRate) ** MONTHS_PER_YEAR - 1);
}
