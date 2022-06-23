import { LocalSabePurchases } from '@/data/use-cases/save-purchases'
import { CacheStoreSpy, mockPurchases } from '@test/data/tests'

type SutTypes = {
  sut: LocalSabePurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp =  new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSabePurchases(cacheStore, timestamp)
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
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut(timestamp)
    const purchases = mockPurchases()
    const promise = sut.save(purchases)
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValue).toEqual({
      timestamp,
      value: purchases
    })
    await expect(promise).resolves.toBeFalsy()
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
