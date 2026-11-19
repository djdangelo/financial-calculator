import { CHART_THEME } from '../constants/loan-analysis.constant';
import { buildYearlyChartData, resolveYearlySeries } from './yearly-chart.function';

describe('yearly chart functions', () => {
  const labels = { years: ['Año 1', 'Año 2'], series: { principal: 'Capital', interest: 'Interés', insurance: 'Seguro' } };
  const years = [
    { year: 1, principal: 120, interest: 60, insurance: 0 },
    { year: 2, principal: 10, interest: 5, insurance: 0 }
  ];

  it('leaves the insurance out when the offer has none', () => {
    expect(resolveYearlySeries(years)).toEqual(['principal', 'interest']);
    expect(resolveYearlySeries([{ ...years[0], insurance: 12 }])).toEqual(['principal', 'interest', 'insurance']);
  });

  it('builds one stacked series per amount with its own color', () => {
    const data = buildYearlyChartData(years, labels, CHART_THEME.light);

    expect(data.labels).toEqual(['Año 1', 'Año 2']);
    expect(data.datasets.map(dataset => dataset.label)).toEqual(['Capital', 'Interés']);
    expect(data.datasets[0].data).toEqual([120, 10]);
    expect(data.datasets[1].backgroundColor).toBe(CHART_THEME.light.interest);
  });
});
