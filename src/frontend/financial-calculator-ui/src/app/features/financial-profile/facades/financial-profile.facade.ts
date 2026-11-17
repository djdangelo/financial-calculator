import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppSettingsFacade } from '@core/facades/app-settings.facade';
import { removeRecord, sortByCreation, upsertRecord } from '@core/functions/record.function';
import { SaveFeedbackService } from '@core/services/save-feedback.service';
import { UserDataService } from '@core/services/user-data.service';
import { DebtType } from '../@types/debt-type.type';
import { ExpenseCategory } from '../@types/expense-category.type';
import { IncomeType } from '../@types/income-type.type';
import { ProfileStepKey } from '../@types/profile-step-key.type';
import { calculateNetMonthlyIncome } from '../functions/net-income.function';
import { createDebt, createExpense, createIncome } from '../functions/profile-factory.function';
import {
  calculateAvailableIncome,
  calculateDebtBalance,
  calculateMonthlyDebtPayments,
  calculateMonthlyExpenses,
  usesAnotherCurrency
} from '../functions/profile-totals.function';
import {
  isDebtsStepComplete,
  isExpensesStepComplete,
  isIncomeStepComplete
} from '../functions/profile-validation.function';
import { Debt, Expense, Income } from '../models';
import { FinancialProfileService } from '../services';

@Injectable({ providedIn: 'root' })
export class FinancialProfileFacade {
  private readonly service = inject(FinancialProfileService);
  private readonly settings = inject(AppSettingsFacade);
  private readonly saveFeedback = inject(SaveFeedbackService);
  private loading?: Promise<void>;

  readonly incomes = signal<Income[]>([]);
  readonly expenses = signal<Expense[]>([]);
  readonly debts = signal<Debt[]>([]);

  readonly netIncome = computed(() =>
    calculateNetMonthlyIncome(this.incomes(), this.settings.summaryCurrency(), this.settings.exchangeRates())
  );
  readonly monthlyExpenses = computed(() =>
    calculateMonthlyExpenses(this.expenses(), this.settings.summaryCurrency(), this.settings.exchangeRates())
  );
  readonly monthlyDebtPayments = computed(() =>
    calculateMonthlyDebtPayments(this.debts(), this.settings.summaryCurrency(), this.settings.exchangeRates())
  );
  readonly debtBalance = computed(() =>
    calculateDebtBalance(this.debts(), this.settings.summaryCurrency(), this.settings.exchangeRates())
  );
  readonly availableIncome = computed(() =>
    calculateAvailableIncome(this.netIncome(), this.monthlyExpenses(), this.monthlyDebtPayments())
  );
  readonly needsExchangeRate = computed(() => {
    const currencies = [...this.incomes(), ...this.expenses(), ...this.debts()].map(entry => entry.currency);
    return usesAnotherCurrency(currencies, this.settings.summaryCurrency());
  });

  readonly isIncomeComplete = computed(() => isIncomeStepComplete(this.incomes()));
  readonly isExpensesComplete = computed(() => isExpensesStepComplete(this.expenses()));
  readonly isDebtsComplete = computed(() => isDebtsStepComplete(this.debts()));
  readonly completedSteps = computed<ProfileStepKey[]>(() => [
    ...(this.isIncomeComplete() ? ['income' as const] : []),
    ...(this.isExpensesComplete() ? ['expenses' as const] : []),
    ...(this.isDebtsComplete() ? ['debts' as const] : [])
  ]);

  constructor() {
    inject(UserDataService).cleared$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.reset());
  }

  load(): Promise<void> {
    this.loading ??= this.readStoredProfile();
    return this.loading;
  }

  addIncome(type: IncomeType): void {
    this.saveIncome(createIncome(type, this.settings.summaryCurrency()));
  }

  saveIncome(income: Income): void {
    this.incomes.update(incomes => upsertRecord(incomes, income));
    this.saveFeedback.track(this.service.saveIncome(income));
  }

  removeIncome(id: string): void {
    this.incomes.update(incomes => removeRecord(incomes, id));
    this.saveFeedback.track(this.service.removeIncome(id));
  }

  addExpense(category: ExpenseCategory): void {
    this.saveExpense(createExpense(category, this.settings.summaryCurrency()));
  }

  saveExpense(expense: Expense): void {
    this.expenses.update(expenses => upsertRecord(expenses, expense));
    this.saveFeedback.track(this.service.saveExpense(expense));
  }

  removeExpense(id: string): void {
    this.expenses.update(expenses => removeRecord(expenses, id));
    this.saveFeedback.track(this.service.removeExpense(id));
  }

  addDebt(type: DebtType): void {
    this.saveDebt(createDebt(type, this.settings.summaryCurrency()));
  }

  saveDebt(debt: Debt): void {
    this.debts.update(debts => upsertRecord(debts, debt));
    this.saveFeedback.track(this.service.saveDebt(debt));
  }

  removeDebt(id: string): void {
    this.debts.update(debts => removeRecord(debts, id));
    this.saveFeedback.track(this.service.removeDebt(id));
  }

  private async readStoredProfile(): Promise<void> {
    const [incomes, expenses, debts] = await Promise.all([
      this.service.getIncomes(),
      this.service.getExpenses(),
      this.service.getDebts(),
      this.settings.load()
    ]);
    this.incomes.set(sortByCreation(incomes));
    this.expenses.set(sortByCreation(expenses));
    this.debts.set(sortByCreation(debts));
  }

  private reset(): void {
    this.incomes.set([]);
    this.expenses.set([]);
    this.debts.set([]);
  }
}
