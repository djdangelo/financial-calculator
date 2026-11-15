import { IDBPDatabase } from 'idb';
import { STORE_KEY_PATH, STORE_NAMES } from '@core/constants/database.constant';

export function createMissingStores(database: IDBPDatabase): void {
  STORE_NAMES
    .filter(storeName => !database.objectStoreNames.contains(storeName))
    .forEach(storeName => database.createObjectStore(storeName, { keyPath: STORE_KEY_PATH }));
}
