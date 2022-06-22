class LocalSabePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
  async save(): Promise<void> {
    this.cacheStore.delete()
  }
}

interface CacheStore {
  delete: () => void
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  delete(): void {
    this.deleteCallsCount++
  }
}

describe('LocalSavePurchases', () => {
  it('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()
    new LocalSabePurchases(cacheStore)
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  it('should delete old cache on sut.save', async () => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSabePurchases(cacheStore)
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })
})
