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
type SutTypes = {
  sut: LocalSabePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSabePurchases(cacheStore)
  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  it('should not delete cache on sut.init', () => {
    const {cacheStore} = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  it('should delete old cache on sut.save', async () => {
    const {cacheStore, sut} = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })
})
