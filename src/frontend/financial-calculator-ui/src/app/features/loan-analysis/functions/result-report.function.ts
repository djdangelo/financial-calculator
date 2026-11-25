import { PdfBlock } from '@core/@types/pdf-block.type';
import { Translate } from '@core/@types/translate.type';
import { formatMoney } from '@core/functions/currency.function';
import { formatPercent, roundMoney } from '@core/functions/finance.function';
import { PdfReport } from '@core/interfaces/pdf-report.interface';
import { RESULT_REPORT_FILE_NAME_KEY, VERDICT_PDF_TONE } from '../constants/loan-analysis.constant';
import { ResultReportInput } from '../interfaces/result-report-input.interface';
import { resolveBurdenStatus } from './burden-status.function';
import {
  buildAmortizationBlocks,
  buildCostBlocks,
  buildDisclaimerBlock,
  buildFact,
  buildFactsBlock,
  buildHeading,
  buildOfferBlocks,
  buildReportFileName,
  buildYearlyChartBlocks
} from './loan-report.function';

export function buildResultReport(input: ResultReportInput, translate: Translate): PdfReport {
  const { analysis, offer } = input;
  return {
    fileName: buildReportFileName(RESULT_REPORT_FILE_NAME_KEY, input.isoDate, translate),
    title: translate('loan_analysis.step.title'),
    subtitle: translate('loan_analysis.step.description'),
    generatedOn: translate('loan_analysis.export.generated_on', { date: input.generatedOn }),
    blocks: [
      buildVerdictBlock(input, translate),
      ...buildOfferBlocks(offer, translate('loan_analysis.export.offer_title'), translate),
      ...buildMaxLoanBlocks(input, translate),
      ...buildIndicatorBlocks(input, translate),
      ...buildBudgetBlocks(input, translate),
      ...buildCostBlocks(analysis.cost, offer, translate),
      ...buildYearlyChartBlocks(input.yearlyPayments, analysis.currency, translate),
      ...buildAmortizationBlocks(analysis.cost.schedule, analysis.currency, translate),
      buildDisclaimerBlock(translate)
    ]
  };
}

function buildVerdictBlock({ analysis }: ResultReportInput, translate: Translate): PdfBlock {
  const params = { total: analysis.limits.totalBurdenPercent, debt: analysis.limits.debtBurdenPercent };
  return {
    kind: 'note',
    tone: VERDICT_PDF_TONE[analysis.verdict],
    title: translate(`loan_analysis.verdict.${analysis.verdict}.title`),
    text: translate(`loan_analysis.verdict.${analysis.verdict}.message`, params)
  };
}

function buildMaxLoanBlocks({ analysis, offer }: ResultReportInput, translate: Translate): PdfBlock[] {
  const t = (key: string, params?: Record<string, unknown>) => translate(`loan_analysis.max_loan.${key}`, params);
  const money = (amount: number) => formatMoney(amount, analysis.currency);
  const { maxLoan } = analysis;
  if (maxLoan.maxAmount <= 0) {
    return [buildHeading(t('title'), t('no_room'))];
  }
  const status = maxLoan.exceedsMax
    ? t('exceeds', { amount: money(roundMoney(offer.amount - maxLoan.maxAmount)) })
    : t('within');
  return [
    buildHeading(t('title'), t('description', { payment: money(maxLoan.maxPayment) })),
    buildFactsBlock([buildFact(t('title'), money(maxLoan.maxAmount), status)])
  ];
}

function buildIndicatorBlocks({ analysis }: ResultReportInput, translate: Translate): PdfBlock[] {
  const t = (key: string, params?: Record<string, unknown>) => translate(`loan_analysis.indicators.${key}`, params);
  const indicator = (labelKey: string, percent: number, limit: number) => {
    const value = Number.isFinite(percent) ? formatPercent(percent) : t('no_income');
    const statusKey = resolveBurdenStatus(percent, limit) === 'over' ? 'over_limit' : 'within_limit';
    return buildFact(t(labelKey), value, t(statusKey, { limit: formatPercent(limit) }));
  };
  return [
    buildHeading(t('title')),
    buildFactsBlock([
      indicator('total', analysis.indicators.totalBurdenPercent, analysis.limits.totalBurdenPercent),
      indicator('debt', analysis.indicators.debtBurdenPercent, analysis.limits.debtBurdenPercent)
    ])
  ];
}

function buildBudgetBlocks({ analysis, isConsolidating }: ResultReportInput, translate: Translate): PdfBlock[] {
  const t = (key: string) => translate(`loan_analysis.budget.${key}`);
  const money = (amount: number) => formatMoney(amount, analysis.currency);
  const { budget } = analysis;
  return [
    buildHeading(t('title')),
    buildFactsBlock([
      buildFact(t('net_income'), money(budget.netIncome)),
      buildFact(t('expenses'), money(-budget.expenses)),
      buildFact(t(isConsolidating ? 'kept_debts' : 'current_debts'), money(-budget.currentDebtPayments)),
      buildFact(t('new_payment'), money(-budget.newLoanPayment)),
      buildFact(t('available'), money(analysis.availableAfterLoan))
    ])
  ];
}
