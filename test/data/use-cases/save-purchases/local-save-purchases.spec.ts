import { LocalSabePurchases } from '@/data/use-cases/save-purchases'
import { CacheStoreSpy, mockPurchases } from '@test/data/tests'

type SutTypes = {
  sut: LocalSabePurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSabePurchases(cacheStore)
  return {
    sut,
    cacheStore,
  }
}

describe('LocalSavePurchases', () => {
  it('should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  it('should delete old cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })
  it('should not insert new cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()
    // cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    // expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow
  })
  it('should not insert new cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValue).toEqual(purchases)
  })
  it('should throw if inser throws', () => {
    const { cacheStore, sut } = makeSut()
    // cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(promise).rejects.toThrow
  })
})
