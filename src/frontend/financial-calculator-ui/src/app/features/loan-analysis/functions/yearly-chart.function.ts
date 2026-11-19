import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { YearlySeriesKey } from '../@types/yearly-series-key.type';
import {
  CHART_BAR_MAX_THICKNESS,
  CHART_BAR_RADIUS,
  CHART_FONT_SIZE,
  CHART_SEGMENT_GAP
} from '../constants/loan-analysis.constant';
import { ChartTheme } from '../interfaces/chart-theme.interface';
import { YearlyChartLabels } from '../interfaces/yearly-chart-labels.interface';
import { YearlyPaymentSummary } from '../interfaces/yearly-payment-summary.interface';

export function resolveYearlySeries(years: readonly YearlyPaymentSummary[]): YearlySeriesKey[] {
  const hasInsurance = years.some(year => year.insurance > 0);
  return hasInsurance ? ['principal', 'interest', 'insurance'] : ['principal', 'interest'];
}

export function buildYearlyChartData(
  years: readonly YearlyPaymentSummary[],
  labels: YearlyChartLabels,
  theme: ChartTheme
): ChartData<'bar'> {
  const series = resolveYearlySeries(years);
  const topSeries = series[series.length - 1];
  const datasets: ChartDataset<'bar'>[] = series.map(key => ({
    label: labels.series[key],
    data: years.map(year => year[key]),
    backgroundColor: theme[key],
    borderColor: theme.surface,
    borderWidth: { top: CHART_SEGMENT_GAP },
    borderSkipped: 'start',
    borderRadius: key === topSeries ? { topLeft: CHART_BAR_RADIUS, topRight: CHART_BAR_RADIUS } : 0,
    maxBarThickness: CHART_BAR_MAX_THICKNESS
  }));
  return { labels: labels.years, datasets };
}

export function buildYearlyChartOptions(theme: ChartTheme, formatAmount: (amount: number) => string): ChartOptions<'bar'> {
  const font = { size: CHART_FONT_SIZE };
  return {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'start', labels: { color: theme.text, font, usePointStyle: true, pointStyle: 'rectRounded' } },
      tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatAmount(context.parsed.y ?? 0)}` } }
    },
    scales: {
      x: { stacked: true, grid: { display: false }, border: { color: theme.grid }, ticks: { color: theme.text, font } },
      y: {
        stacked: true,
        border: { display: false },
        grid: { color: theme.grid },
        ticks: { color: theme.text, font, callback: value => formatAmount(Number(value)) }
      }
    }
  };
}
