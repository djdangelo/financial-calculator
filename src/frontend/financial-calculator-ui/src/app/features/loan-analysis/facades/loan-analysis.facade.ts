import { Injectable, computed, inject } from '@angular/core';
import { EXCHANGE_STRESS_PERCENT } from '@core/constants/market.constant';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { FinancialProfileFacade } from '@features/financial-profile/facades';
import { calculateNetMonthlyIncome } from '@features/financial-profile/functions/net-income.function';
import {
  calculateMonthlyDebtPayments,
  calculateMonthlyExpenses,
  usesAnotherCurrency
} from '@features/financial-profile/functions/profile-totals.function';
import { LoanOffersFacade } from '@features/loan-offers/facades';
import { isDebtConsolidated } from '@features/loan-offers/functions/consolidated-debts.function';
import { isLoanOfferValid } from '@features/loan-offers/functions/offer-validation.function';
import { LoanOffer } from '@features/loan-offers/models';
import { BestOffers } from '../@types/best-offers.type';
import { MIN_OFFERS_TO_COMPARE } from '../constants/loan-analysis.constant';
import { analyzeDebtConsolidation } from '../functions/debt-consolidation.function';
import { assessExchangeRisk } from '../functions/exchange-risk.function';
import { buildIncomeDistribution } from '../functions/income-distribution.function';
import { analyzeLoan } from '../functions/loan-analysis.function';
import { findBestOffers } from '../functions/offer-comparison.function';
import { summarizePaymentsByYear } from '../functions/yearly-payments.function';
import { DebtConsolidation } from '../interfaces/debt-consolidation.interface';
import { ExchangeRisk } from '../interfaces/exchange-risk.interface';
import { LoanAnalysis } from '../interfaces/loan-analysis.interface';
import { OfferComparison } from '../interfaces/offer-comparison.interface';

@Injectable({ providedIn: 'root' })
export class LoanAnalysisFacade {
  private readonly profile = inject(FinancialProfileFacade);
  private readonly offers = inject(LoanOffersFacade);
  private readonly settings = inject(AppSettingsFacade);

  readonly completedSteps = this.offers.completedSteps;
  readonly debts = this.profile.debts;
  readonly activeOffer = this.offers.offer;

  readonly consolidatedDebts = computed(() => {
    const offer = this.offers.offer();
    return offer === null ? [] : this.debts().filter(debt => isDebtConsolidated(offer, debt.id));
  });
  readonly isConsolidating = computed(() => this.consolidatedDebts().length > 0);

  readonly analysis = computed<LoanAnalysis | null>(() => {
    const offer = this.offers.offer();
    return offer !== null && this.offers.isOfferComplete() ? this.analyzeOffer(offer) : null;
  });

  readonly consolidation = computed<DebtConsolidation | null>(() => {
    const analysis = this.analysis();
    if (analysis === null || !this.isConsolidating()) {
      return null;
    }

    return analyzeDebtConsolidation({
      debts: this.consolidatedDebts(),
      currency: analysis.currency,
      rates: this.settings.exchangeRates(),
      cost: analysis.cost,
      verdict: analysis.verdict
    });
  });

  readonly exchangeRisk = computed<ExchangeRisk | null>(() => {
    const analysis = this.analysis();
    return analysis === null
      ? null
      : assessExchangeRisk({
        incomes: this.profile.incomes(),
        loanCurrency: analysis.currency,
        monthlyPayment: analysis.cost.monthlyPayment,
        rates: this.settings.exchangeRates(),
        stressPercent: EXCHANGE_STRESS_PERCENT
      });
  });

  readonly incomeDistribution = computed(() => {
    const analysis = this.analysis();
    return analysis === null ? [] : buildIncomeDistribution(analysis.budget);
  });
  readonly yearlyPayments = computed(() => summarizePaymentsByYear(this.analysis()?.cost.schedule ?? []));

  readonly comparisons = computed<OfferComparison[]>(() =>
    this.offers.offers().flatMap((offer, index) =>
      isLoanOfferValid(offer) ? [{ offer, analysis: this.analyzeOffer(offer), position: index + 1 }] : []
    )
  );
  readonly canCompare = computed(() => this.comparisons().length >= MIN_OFFERS_TO_COMPARE);
  readonly bestOffers = computed<BestOffers | null>(() => {
    const analysis = this.analysis();
    return analysis === null
      ? null
      : findBestOffers(this.comparisons(), analysis.currency, this.settings.exchangeRates());
  });

  readonly usesExchangeRate = computed(() => {
    const offer = this.offers.offer();
    const entries = [...this.profile.incomes(), ...this.profile.expenses(), ...this.debts()];
    return offer !== null && usesAnotherCurrency(entries.map(entry => entry.currency), offer.currency);
  });

  selectOffer(id: string): void {
    this.offers.selectOffer(id);
  }

  toggleConsolidatedDebt(debtId: string): void {
    this.offers.toggleConsolidatedDebt(debtId);
  }

  private analyzeOffer(offer: LoanOffer): LoanAnalysis {
    const rates = this.settings.exchangeRates();
    const keptDebts = this.debts().filter(debt => !isDebtConsolidated(offer, debt.id));
    return analyzeLoan({
      offer,
      netIncome: calculateNetMonthlyIncome(this.profile.incomes(), offer.currency, rates),
      expenses: calculateMonthlyExpenses(this.profile.expenses(), offer.currency, rates),
      currentDebtPayments: calculateMonthlyDebtPayments(keptDebts, offer.currency, rates),
      limits: this.settings.burdenLimits()
    });
  }
}
