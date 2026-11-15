import { MONEY_DECIMALS, MONTHS_PER_YEAR, PERCENT_BASE } from '@core/constants/finance.constant';

export function roundMoney(amount: number): number {
  const factor = 10 ** MONEY_DECIMALS;
  return Math.round((amount + Number.EPSILON) * factor) / factor;
}

export function percentToRatio(percent: number): number {
  return percent / PERCENT_BASE;
}

export function ratioToPercent(ratio: number): number {
  return ratio * PERCENT_BASE;
}

export function monthlyRateFromAnnualPercent(annualRatePercent: number): number {
  return percentToRatio(annualRatePercent) / MONTHS_PER_YEAR;
}

export function sumAmounts(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}
