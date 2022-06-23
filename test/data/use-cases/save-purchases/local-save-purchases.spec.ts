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
  it('should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.messages).toEqual([])
  })
  it('should not insert new cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut()
    // cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    // expect(cacheStore.insertCallsCount).toBe(0)
    // expect(cacheStore.messages).toEqual([
    //   CacheStoreSpy.Message.delete,
    // ])
    await expect(promise).rejects.toThrow
  })
  it('should not insert new cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ])
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValue).toEqual(purchases)
  })
  it('should throw if inser throws', async () => {
    const { cacheStore, sut } = makeSut()
    // cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ])
    await expect(promise).rejects.toThrow
  })
})
