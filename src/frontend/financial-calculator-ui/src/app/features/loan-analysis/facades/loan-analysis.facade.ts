import { Injectable, computed, inject } from '@angular/core';
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
import { analyzeDebtConsolidation } from '../functions/debt-consolidation.function';
import { analyzeLoan } from '../functions/loan-analysis.function';
import { DebtConsolidation } from '../interfaces/debt-consolidation.interface';
import { LoanAnalysis } from '../interfaces/loan-analysis.interface';

@Injectable({ providedIn: 'root' })
export class LoanAnalysisFacade {
  private readonly profile = inject(FinancialProfileFacade);
  private readonly offers = inject(LoanOffersFacade);
  private readonly settings = inject(AppSettingsFacade);

  readonly completedSteps = this.offers.completedSteps;
  readonly debts = this.profile.debts;

  readonly consolidatedDebts = computed(() => {
    const offer = this.offers.offer();
    return offer === null ? [] : this.debts().filter(debt => isDebtConsolidated(offer, debt.id));
  });
  readonly isConsolidating = computed(() => this.consolidatedDebts().length > 0);

  readonly analysis = computed<LoanAnalysis | null>(() => {
    const offer = this.offers.offer();
    if (offer === null || !this.offers.isOfferComplete()) {
      return null;
    }

    const rates = this.settings.exchangeRates();
    const keptDebts = this.debts().filter(debt => !isDebtConsolidated(offer, debt.id));
    return analyzeLoan({
      offer,
      netIncome: calculateNetMonthlyIncome(this.profile.incomes(), offer.currency, rates),
      expenses: calculateMonthlyExpenses(this.profile.expenses(), offer.currency, rates),
      currentDebtPayments: calculateMonthlyDebtPayments(keptDebts, offer.currency, rates),
      limits: this.settings.burdenLimits()
    });
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

  readonly usesExchangeRate = computed(() => {
    const offer = this.offers.offer();
    const entries = [...this.profile.incomes(), ...this.profile.expenses(), ...this.debts()];
    return offer !== null && usesAnotherCurrency(entries.map(entry => entry.currency), offer.currency);
  });

  toggleConsolidatedDebt(debtId: string): void {
    this.offers.toggleConsolidatedDebt(debtId);
  }
}
