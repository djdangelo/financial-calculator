import { StoredRecord } from '@core/interfaces/stored-record.interface';

export function findNeighborOfferId(offers: readonly StoredRecord[], removedId: string): string | null {
  const index = offers.findIndex(offer => offer.id === removedId);
  const remaining = offers.filter(offer => offer.id !== removedId);
  if (remaining.length === 0) {
    return null;
  }
  return remaining[Math.min(Math.max(index, 0), remaining.length - 1)].id;
}
