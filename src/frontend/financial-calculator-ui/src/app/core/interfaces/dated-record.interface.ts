import { StoredRecord } from './stored-record.interface';

export interface DatedRecord extends StoredRecord {
  createdAt: number;
}
