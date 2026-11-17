import { WizardStep } from '@shared/interfaces/wizard-step.interface';
import { buildWizardStepViews, findNextRoute, findPreviousRoute, findStepRoute } from './wizard.util';

describe('wizard utils', () => {
  const steps: WizardStep[] = [
    { key: 'income', route: '/income' },
    { key: 'expenses', route: '/expenses' },
    { key: 'debts', route: '/debts' },
    { key: 'offer', route: null }
  ];

  it('marks the previous completed steps and the current one', () => {
    const views = buildWizardStepViews(steps, 'expenses', ['income']);

    expect(views.map(view => view.status)).toEqual(['complete', 'current', 'upcoming', 'upcoming']);
    expect(views.map(view => view.number)).toEqual([1, 2, 3, 4]);
  });

  it('reaches a step only when every previous one is complete', () => {
    const views = buildWizardStepViews(steps, 'income', ['income']);

    expect(views.map(view => view.reachable)).toEqual([true, true, false, false]);
  });

  it('never reaches a step without a route', () => {
    const views = buildWizardStepViews(steps, 'debts', ['income', 'expenses', 'debts']);

    expect(views[3].reachable).toBeFalse();
  });

  it('finds the routes around a step', () => {
    expect(findStepRoute(steps, 'expenses')).toBe('/expenses');
    expect(findPreviousRoute(steps, 'income')).toBeNull();
    expect(findPreviousRoute(steps, 'expenses')).toBe('/income');
    expect(findNextRoute(steps, 'expenses')).toBe('/debts');
    expect(findNextRoute(steps, 'debts')).toBeNull();
    expect(findNextRoute(steps, 'offer')).toBeNull();
  });
});
