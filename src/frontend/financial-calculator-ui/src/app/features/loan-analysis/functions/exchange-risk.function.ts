import { convertAmount, sumInCurrency } from '@core/functions/currency.function';
import { percentToRatio, ratioToPercent, roundMoney } from '@core/functions/finance.function';
import { calculateIncomeContribution } from '@features/financial-profile/functions/net-income.function';
import { ExchangeRisk } from '../interfaces/exchange-risk.interface';
import { ExchangeRiskInput } from '../interfaces/exchange-risk-input.interface';

export function assessExchangeRisk({
  incomes,
  loanCurrency,
  monthlyPayment,
  rates,
  stressPercent
}: ExchangeRiskInput): ExchangeRisk | null {
  const contributions = incomes
    .map(income => ({ amount: calculateIncomeContribution(income), currency: income.currency }))
    .filter(contribution => contribution.amount > 0);
  const foreign = contributions.filter(contribution => contribution.currency !== loanCurrency);
  if (foreign.length === 0) {
    return null;
  }

  const totalIncome = sumInCurrency(contributions, loanCurrency, rates);
  const foreignIncome = sumInCurrency(foreign, loanCurrency, rates);
  const [largest] = [...foreign].sort(
    (first, second) =>
      convertAmount(second.amount, second.currency, loanCurrency, rates)
      - convertAmount(first.amount, first.currency, loanCurrency, rates)
  );
  const paymentInIncomeCurrency = convertAmount(monthlyPayment, loanCurrency, largest.currency, rates);

  return {
    incomeCurrency: largest.currency,
    foreignIncomePercent: ratioToPercent(foreignIncome / totalIncome),
    paymentInIncomeCurrency: roundMoney(paymentInIncomeCurrency),
    stressedPayment: roundMoney(paymentInIncomeCurrency * (1 + percentToRatio(stressPercent))),
    stressPercent
  };
}
