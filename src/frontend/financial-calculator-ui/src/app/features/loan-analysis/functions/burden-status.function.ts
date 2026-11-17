import { BurdenStatus } from '../@types/burden-status.type';
import { MAX_BAR_PERCENT } from '../constants/loan-analysis.constant';

export function resolveBurdenStatus(percent: number, limit: number): BurdenStatus {
  return percent > limit ? 'over' : 'within';
}

export function toBarWidthPercent(percent: number): number {
  return Math.min(Math.max(percent, 0), MAX_BAR_PERCENT);
}
