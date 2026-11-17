import { createRecordId, removeRecord, sortByCreation, upsertRecord } from './record.function';

describe('record functions', () => {
  const first = { id: 'a', createdAt: 1, value: 10 };
  const second = { id: 'b', createdAt: 2, value: 20 };

  it('creates a different id each time', () => {
    expect(createRecordId()).not.toBe(createRecordId());
  });

  it('appends a record that does not exist', () => {
    expect(upsertRecord([first], second)).toEqual([first, second]);
  });

  it('replaces a record in its position', () => {
    const updated = { ...first, value: 15 };
    expect(upsertRecord([first, second], updated)).toEqual([updated, second]);
  });

  it('removes a record by id', () => {
    expect(removeRecord([first, second], 'a')).toEqual([second]);
  });

  it('sorts by creation and then by id', () => {
    const sameMoment = { id: 'c', createdAt: 1, value: 30 };
    expect(sortByCreation([second, sameMoment, first])).toEqual([first, sameMoment, second]);
  });
});
