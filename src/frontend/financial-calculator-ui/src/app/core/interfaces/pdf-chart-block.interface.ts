import type { ChartConfiguration } from 'chart.js';

export interface PdfChartBlock {
  kind: 'chart';
  configuration: ChartConfiguration;
}
