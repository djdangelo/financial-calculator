import { GuideExample } from './guide-example.interface';

export interface GuideExampleView extends GuideExample {
  outcomeClass: string;
  outcomeIcon: string;
}
