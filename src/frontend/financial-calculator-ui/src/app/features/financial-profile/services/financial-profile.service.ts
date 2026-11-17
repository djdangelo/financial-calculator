import { Injectable, inject } from '@angular/core';
import { IndexedDbRepository } from '@core/repositories/indexed-db.repository';
import { Debt, Expense, Income } from '../models';

@Injectable({ providedIn: 'root' })
export class FinancialProfileService {
  private readonly repository = inject(IndexedDbRepository);

  getIncomes(): Promise<Income[]> {
    return this.repository.getAll<Income>('incomes');
  }

  saveIncome(income: Income): Promise<void> {
    return this.repository.save('incomes', income);
  }

  removeIncome(id: string): Promise<void> {
    return this.repository.remove('incomes', id);
  }

  getExpenses(): Promise<Expense[]> {
    return this.repository.getAll<Expense>('expenses');
  }

  saveExpense(expense: Expense): Promise<void> {
    return this.repository.save('expenses', expense);
  }

  removeExpense(id: string): Promise<void> {
    return this.repository.remove('expenses', id);
  }

  getDebts(): Promise<Debt[]> {
    return this.repository.getAll<Debt>('debts');
  }

  saveDebt(debt: Debt): Promise<void> {
    return this.repository.save('debts', debt);
  }

  removeDebt(id: string): Promise<void> {
    return this.repository.remove('debts', id);
  }
}
