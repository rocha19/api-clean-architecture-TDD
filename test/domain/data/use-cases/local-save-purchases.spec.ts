class LocalSabePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
}

interface CacheStore { }

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
}

describe('LocalSavePurchases', () => {
  it('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()
    new LocalSabePurchases(cacheStore)
    expect(cacheStore.deleteCallsCount).toBe(0)
  });
});