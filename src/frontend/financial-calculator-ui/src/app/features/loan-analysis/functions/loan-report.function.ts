import { CurrencyCode } from '@core/@types/currency-code.type';
import { PdfBlock } from '@core/@types/pdf-block.type';
import { Translate } from '@core/@types/translate.type';
import { PDF_FILE_EXTENSION } from '@core/constants/pdf.constant';
import { formatMoney } from '@core/functions/currency.function';
import { formatPercent } from '@core/functions/finance.function';
import { PdfFact } from '@core/interfaces/pdf-fact.interface';
import { PdfFactsBlock } from '@core/interfaces/pdf-facts-block.interface';
import { PdfHeadingBlock } from '@core/interfaces/pdf-heading-block.interface';
import { PdfNoteBlock } from '@core/interfaces/pdf-note-block.interface';
import { PdfTableColumn } from '@core/interfaces/pdf-table-column.interface';
import { LoanOffer } from '@features/loan-offers/models';
import { AmortizationRow } from '../interfaces/amortization-row.interface';
import { LoanCostSummary } from '../interfaces/loan-cost-summary.interface';
import { YearlyPaymentSummary } from '../interfaces/yearly-payment-summary.interface';
import { buildYearlyChartConfiguration } from './yearly-chart.function';

export function buildFact(label: string, value: string, detail = ''): PdfFact {
  return { label, value, detail };
}

export function buildHeading(title: string, description = ''): PdfHeadingBlock {
  return { kind: 'heading', title, description };
}

export function buildFactsBlock(facts: PdfFact[]): PdfFactsBlock {
  return { kind: 'facts', facts };
}

export function buildReportFileName(nameKey: string, isoDate: string, translate: Translate): string {
  return `${translate(nameKey)}-${isoDate}${PDF_FILE_EXTENSION}`;
}

export function buildOfferBlocks(offer: LoanOffer, title: string, translate: Translate): PdfBlock[] {
  const label = (key: string) => translate(`loan_offers.form.${key}`);
  const money = (amount: number) => formatMoney(amount, offer.currency);
  const facts = [
    ...(offer.bankName.trim() ? [buildFact(label('bank_name'), offer.bankName.trim())] : []),
    buildFact(label('amount'), money(offer.amount)),
    buildFact(label('annual_rate'), formatPercent(offer.annualRatePercent)),
    buildFact(label('term'), String(offer.termMonths)),
    ...(offer.disbursementFeePercent > 0
      ? [buildFact(label('disbursement_fee'), formatPercent(offer.disbursementFeePercent), label(`fee_modes.${offer.feeMode}`))]
      : []),
    ...(offer.monthlyInsurance > 0 ? [buildFact(label('monthly_insurance'), money(offer.monthlyInsurance))] : []),
    ...(offer.otherInitialCharges > 0 ? [buildFact(label('other_charges'), money(offer.otherInitialCharges))] : [])
  ];
  return [buildHeading(title), buildFactsBlock(facts)];
}

export function buildCostBlocks(
  cost: LoanCostSummary,
  offer: LoanOffer,
  translate: Translate
): PdfBlock[] {
  const t = (key: string, params?: Record<string, unknown>) => translate(`loan_analysis.cost.${key}`, params);
  const money = (amount: number) => formatMoney(amount, offer.currency);
  const facts = [
    buildFact(
      t('monthly_payment'),
      money(cost.monthlyPayment),
      cost.monthlyInsurance > 0
        ? t('payment_breakdown', { payment: money(cost.levelPayment), insurance: money(cost.monthlyInsurance) })
        : ''
    ),
    buildFact(
      t('net_disbursement'),
      money(cost.netDisbursement),
      cost.disbursementFee > 0 ? t(`fee.${offer.feeMode}`, { fee: money(cost.disbursementFee) }) : ''
    ),
    buildFact(t('total_paid'), money(cost.totalPaid), t('total_cost', { cost: money(cost.totalCost) })),
    buildFact(
      t('effective_cost'),
      formatPercent(cost.effectiveAnnualCostPercent),
      t('effective_cost_hint', { rate: formatPercent(offer.annualRatePercent) })
    ),
    buildFact(t('financed_principal'), money(cost.financedPrincipal)),
    buildFact(t('total_interest'), money(cost.totalInterest)),
    ...(cost.totalInsurance > 0 ? [buildFact(t('total_insurance'), money(cost.totalInsurance))] : [])
  ];
  return [buildHeading(t('title'), t('description')), buildFactsBlock(facts)];
}

export function buildYearlyChartBlocks(
  years: readonly YearlyPaymentSummary[],
  currency: CurrencyCode,
  translate: Translate
): PdfBlock[] {
  return [
    buildHeading(translate('loan_analysis.yearly.title'), translate('loan_analysis.yearly.description')),
    { kind: 'chart', configuration: buildYearlyChartConfiguration(years, translate, amount => formatMoney(amount, currency)) }
  ];
}

export function buildAmortizationBlocks(
  rows: readonly AmortizationRow[],
  currency: CurrencyCode,
  translate: Translate,
  dueDates: readonly string[] = []
): PdfBlock[] {
  const t = (key: string) => translate(`loan_analysis.amortization.${key}`);
  const money = (amount: number) => formatMoney(amount, currency);
  const hasDates = dueDates.length > 0;
  const hasInsurance = rows.some(row => row.insurance > 0);
  const columns: PdfTableColumn[] = [
    { header: t('columns.period'), align: 'left' },
    ...(hasDates ? [{ header: t('columns.date'), align: 'left' } as const] : []),
    { header: t('columns.payment'), align: 'right' },
    { header: t('columns.interest'), align: 'right' },
    { header: t('columns.principal'), align: 'right' },
    ...(hasInsurance ? [{ header: t('columns.insurance'), align: 'right' } as const] : []),
    { header: t('columns.balance'), align: 'right' }
  ];
  const tableRows = rows.map((row, index) => [
    String(row.period),
    ...(hasDates ? [dueDates[index] ?? ''] : []),
    money(row.totalPayment),
    money(row.interest),
    money(row.principal),
    ...(hasInsurance ? [money(row.insurance)] : []),
    money(row.balance)
  ]);
  return [buildHeading(t('title'), t('description')), { kind: 'table', columns, rows: tableRows }];
}

export function buildDisclaimerBlock(translate: Translate): PdfNoteBlock {
  return { kind: 'note', tone: 'neutral', title: '', text: translate('layout.footer.disclaimer') };
}
