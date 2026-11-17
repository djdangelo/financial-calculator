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
import { analyzeLoan } from '../functions/loan-analysis.function';
import { LoanAnalysis } from '../interfaces/loan-analysis.interface';

@Injectable({ providedIn: 'root' })
export class LoanAnalysisFacade {
  private readonly profile = inject(FinancialProfileFacade);
  private readonly offers = inject(LoanOffersFacade);
  private readonly settings = inject(AppSettingsFacade);

  readonly completedSteps = this.offers.completedSteps;

  readonly analysis = computed<LoanAnalysis | null>(() => {
    const offer = this.offers.offer();
    if (offer === null || !this.offers.isOfferComplete()) {
      return null;
    }

    const rates = this.settings.exchangeRates();
    return analyzeLoan({
      offer,
      netIncome: calculateNetMonthlyIncome(this.profile.incomes(), offer.currency, rates),
      expenses: calculateMonthlyExpenses(this.profile.expenses(), offer.currency, rates),
      currentDebtPayments: calculateMonthlyDebtPayments(this.profile.debts(), offer.currency, rates),
      limits: this.settings.burdenLimits()
    });
  });

  readonly usesExchangeRate = computed(() => {
    const offer = this.offers.offer();
    const entries = [...this.profile.incomes(), ...this.profile.expenses(), ...this.profile.debts()];
    return offer !== null && usesAnotherCurrency(entries.map(entry => entry.currency), offer.currency);
  });
}
