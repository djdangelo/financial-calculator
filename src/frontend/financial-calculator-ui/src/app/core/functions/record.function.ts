import { DatedRecord } from '@core/interfaces/dated-record.interface';
import { StoredRecord } from '@core/interfaces/stored-record.interface';

export function createRecordId(): string {
  return crypto.randomUUID();
}

export function upsertRecord<T extends StoredRecord>(records: readonly T[], record: T): T[] {
  const exists = records.some(current => current.id === record.id);
  return exists ? records.map(current => (current.id === record.id ? record : current)) : [...records, record];
}

export function removeRecord<T extends StoredRecord>(records: readonly T[], id: string): T[] {
  return records.filter(record => record.id !== id);
}

export function sortByCreation<T extends DatedRecord>(records: readonly T[]): T[] {
  return [...records].sort((first, second) => first.createdAt - second.createdAt || first.id.localeCompare(second.id));
}
