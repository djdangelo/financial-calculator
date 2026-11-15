import { TestBed } from '@angular/core/testing';
import { StoredRecord } from '@core/interfaces/stored-record.interface';
import { IndexedDbRepository } from './indexed-db.repository';

describe('IndexedDbRepository', () => {
  let repository: IndexedDbRepository;

  beforeEach(async () => {
    repository = TestBed.inject(IndexedDbRepository);
    await repository.clearAll();
  });

  afterAll(async () => {
    await repository.clearAll();
  });

  it('saves and reads records', async () => {
    await repository.save('incomes', { id: 'a' });
    await repository.save('incomes', { id: 'b' });

    expect((await repository.getAll('incomes')).map(record => record.id)).toEqual(['a', 'b']);
    expect(await repository.getById('incomes', 'b')).toEqual({ id: 'b' });
    expect(await repository.getById('incomes', 'missing')).toBeUndefined();
  });

  it('replaces a record with the same id', async () => {
    await repository.save('settings', { id: 'limits', value: 80 });
    await repository.save('settings', { id: 'limits', value: 70 });

    const records = await repository.getAll<StoredRecord & { value: number }>('settings');
    expect(records.length).toBe(1);
    expect(records[0].value).toBe(70);
  });

  it('removes a single record', async () => {
    await repository.save('debts', { id: 'a' });
    await repository.save('debts', { id: 'b' });
    await repository.remove('debts', 'a');

    expect(await repository.getAll('debts')).toEqual([{ id: 'b' }]);
  });

  it('clears every store', async () => {
    await repository.save('incomes', { id: 'a' });
    await repository.save('loan-offers', { id: 'b' });
    await repository.clearAll();

    expect(await repository.getAll('incomes')).toEqual([]);
    expect(await repository.getAll('loan-offers')).toEqual([]);
  });
});
