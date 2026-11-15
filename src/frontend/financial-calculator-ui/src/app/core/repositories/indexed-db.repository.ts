import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { StoreName } from '@core/@types/store-name.type';
import { DATABASE_NAME, DATABASE_VERSION, STORE_NAMES } from '@core/constants/database.constant';
import { createMissingStores } from '@core/functions/database.function';
import { StoredRecord } from '@core/interfaces/stored-record.interface';

@Injectable({ providedIn: 'root' })
export class IndexedDbRepository {
  private database?: Promise<IDBPDatabase>;

  async getAll<T extends StoredRecord>(storeName: StoreName): Promise<T[]> {
    return (await this.open()).getAll(storeName);
  }

  async getById<T extends StoredRecord>(storeName: StoreName, id: string): Promise<T | undefined> {
    return (await this.open()).get(storeName, id);
  }

  async save<T extends StoredRecord>(storeName: StoreName, record: T): Promise<void> {
    await (await this.open()).put(storeName, record);
  }

  async remove(storeName: StoreName, id: string): Promise<void> {
    await (await this.open()).delete(storeName, id);
  }

  async clear(storeName: StoreName): Promise<void> {
    await (await this.open()).clear(storeName);
  }

  async clearAll(): Promise<void> {
    const transaction = (await this.open()).transaction([...STORE_NAMES], 'readwrite');
    await Promise.all([
      ...STORE_NAMES.map(storeName => transaction.objectStore(storeName).clear()),
      transaction.done
    ]);
  }

  private open(): Promise<IDBPDatabase> {
    this.database ??= openDB(DATABASE_NAME, DATABASE_VERSION, { upgrade: createMissingStores });
    return this.database;
  }
}
