import { Routes } from '@angular/router';
import { profileStepGuard } from './guards/profile-step.guard';

export const financialProfileRoutes: Routes = [
  {
    path: 'income',
    canActivate: [profileStepGuard('income')],
    loadComponent: () => import('./pages/income-step/income-step.component').then(m => m.IncomeStepComponent)
  },
  {
    path: 'expenses',
    canActivate: [profileStepGuard('expenses')],
    loadComponent: () => import('./pages/expenses-step/expenses-step.component').then(m => m.ExpensesStepComponent)
  },
  {
    path: 'debts',
    canActivate: [profileStepGuard('debts')],
    loadComponent: () => import('./pages/debts-step/debts-step.component').then(m => m.DebtsStepComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'income' }
];
