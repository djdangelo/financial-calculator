import { PdfBlock } from '@core/@types/pdf-block.type';
import { Translate } from '@core/@types/translate.type';
import { formatMoney } from '@core/functions/currency.function';
import { formatPercent } from '@core/functions/finance.function';
import { PdfReport } from '@core/interfaces/pdf-report.interface';
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
} from '@features/loan-analysis/functions/loan-report.function';
import {
  BALANCE_INSURANCE_DECIMALS,
  QUOTE_STATUS_TONE,
  VERIFICATION_REPORT_FILE_NAME_KEY
} from '../constants/offer-verification.constant';
import { QuoteCheck } from '../interfaces/quote-check.interface';
import { VerificationReportInput } from '../interfaces/verification-report-input.interface';
import { hasRateChange, toLoanOffer } from './verification-factory.function';

export function buildQuoteMessage(quote: QuoteCheck, money: (amount: number) => string, translate: Translate): string {
  const message = translate(`offer_verification.quote.${quote.status}.message`, {
    quoted: money(quote.quotedPayment),
    calculated: money(quote.calculatedPayment),
    difference: money(Math.abs(quote.difference)),
    total: money(Math.abs(quote.differenceOverTerm))
  });
  return quote.impliedAnnualRatePercent === null
    ? message
    : `${message} ${translate('offer_verification.quote.implied_rate', { rate: formatPercent(quote.impliedAnnualRatePercent) })}`;
}

export function buildVerificationReport(input: VerificationReportInput, translate: Translate): PdfReport {
  const { verification, summary } = input;
  const offer = toLoanOffer(verification);
  return {
    fileName: buildReportFileName(VERIFICATION_REPORT_FILE_NAME_KEY, input.isoDate, translate),
    title: translate('offer_verification.title'),
    subtitle: translate('offer_verification.description'),
    generatedOn: translate('offer_verification.export.generated_on', { date: input.generatedOn }),
    blocks: [
      ...buildQuoteBlocks(input, translate),
      ...buildOfferBlocks(offer, translate('offer_verification.export.offer_title'), translate),
      ...buildConditionBlocks(input, translate),
      ...buildCostBlocks(summary.cost, offer, translate),
      ...buildPayoffBlocks(input, translate),
      ...buildYearlyChartBlocks(summary.yearlyPayments, summary.currency, translate),
      ...buildAmortizationBlocks(summary.cost.schedule, summary.currency, translate, input.formattedDueDates),
      buildDisclaimerBlock(translate)
    ]
  };
}

function buildQuoteBlocks({ summary }: VerificationReportInput, translate: Translate): PdfBlock[] {
  const quote = summary.quote;
  if (quote === null) {
    return [];
  }
  const money = (amount: number) => formatMoney(amount, summary.currency);
  return [{
    kind: 'note',
    tone: QUOTE_STATUS_TONE[quote.status],
    title: translate(`offer_verification.quote.${quote.status}.title`),
    text: buildQuoteMessage(quote, money, translate)
  }];
}

function buildConditionBlocks(
  { verification, summary, formattedDueDates }: VerificationReportInput,
  translate: Translate
): PdfBlock[] {
  const t = (key: string) => translate(`offer_verification.extras.${key}`);
  const money = (amount: number) => formatMoney(amount, summary.currency);
  const facts = [
    buildFact(t('first_payment_date'), formattedDueDates[0] ?? ''),
    ...(verification.quotedPayment > 0 ? [buildFact(t('quoted_payment'), money(verification.quotedPayment))] : []),
    ...(verification.graceMonths > 0 ? [buildFact(t('grace_months'), String(verification.graceMonths))] : []),
    ...(hasRateChange(verification)
      ? [buildFact(t('rate_change_month'), String(verification.rateChangeMonth), formatPercent(verification.rateChangeAnnualRatePercent))]
      : []),
    ...(verification.balanceInsuranceRatePercent > 0
      ? [buildFact(t('balance_insurance'), formatPercent(verification.balanceInsuranceRatePercent, BALANCE_INSURANCE_DECIMALS))]
      : []),
    ...(verification.extraMonthlyPayment > 0 ? [buildFact(t('extra_payment'), money(verification.extraMonthlyPayment))] : [])
  ];
  return [buildHeading(translate('offer_verification.export.conditions_title')), buildFactsBlock(facts)];
}

function buildPayoffBlocks({ summary, formattedDueDates }: VerificationReportInput, translate: Translate): PdfBlock[] {
  if (!summary.paidOffEarly) {
    return [];
  }
  return [{
    kind: 'note',
    tone: 'positive',
    title: '',
    text: translate('offer_verification.payoff.early', {
      months: summary.cost.schedule.length,
      date: formattedDueDates[formattedDueDates.length - 1] ?? ''
    })
  }];
}
