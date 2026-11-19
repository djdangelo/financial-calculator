import { LoanOffer } from '../models';

export function toggleConsolidatedDebt(offer: LoanOffer, debtId: string): LoanOffer {
  const ids = offer.consolidatedDebtIds;
  const consolidatedDebtIds = ids.includes(debtId) ? ids.filter(id => id !== debtId) : [...ids, debtId];
  return { ...offer, consolidatedDebtIds };
}

export function isDebtConsolidated(offer: LoanOffer, debtId: string): boolean {
  return offer.consolidatedDebtIds.includes(debtId);
}
