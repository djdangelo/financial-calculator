import { GuideOutcome } from '../@types/guide-outcome.type';
import { GuideItem } from './guide-item.interface';

export interface GuideExample extends GuideItem {
  facts: readonly string[];
  outcome: GuideOutcome;
}
