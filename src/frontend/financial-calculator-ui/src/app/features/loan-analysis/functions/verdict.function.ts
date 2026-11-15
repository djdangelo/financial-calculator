import { BurdenLimits } from '@core/interfaces/burden-limits.interface';
import { Verdict } from '../@types/verdict.type';
import { DebtIndicators } from '../interfaces/debt-indicators.interface';

export function resolveVerdict(indicators: DebtIndicators, limits: BurdenLimits): Verdict {
  if (indicators.totalBurdenPercent > limits.totalBurdenPercent) {
    return 'not-recommended';
  }
  if (indicators.debtBurdenPercent > limits.debtBurdenPercent) {
    return 'caution';
  }
  return 'can-take';
}
