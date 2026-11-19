import { findNeighborOfferId } from './offer-list.function';

describe('findNeighborOfferId', () => {
  const offers = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('selects the next offer when one in the middle is removed', () => {
    expect(findNeighborOfferId(offers, 'b')).toBe('c');
  });

  it('selects the previous offer when the last one is removed', () => {
    expect(findNeighborOfferId(offers, 'c')).toBe('b');
  });

  it('selects the next offer when the first one is removed', () => {
    expect(findNeighborOfferId(offers, 'a')).toBe('b');
  });

  it('returns null when no offer is left', () => {
    expect(findNeighborOfferId([{ id: 'a' }], 'a')).toBeNull();
  });
});
