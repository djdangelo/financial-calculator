import { YearlySeriesKey } from '../@types/yearly-series-key.type';

export interface YearlyChartLabels {
  years: string[];
  series: Record<YearlySeriesKey, string>;
}
