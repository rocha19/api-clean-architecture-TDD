import { LocalLoadPurchases } from '@/data/use-cases/load-purchases'
import { CacheStoreSpy, getCacheExpirationDate, mockPurchases } from '@test/data/tests'

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)
  return {
    sut,
    cacheStore,
  }
}
describe('LocalSavePurchases', () => {
  it('should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })
  it('should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
  it('should return a list of purchases if cache is valid', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual(cacheStore.fetchResult.value)
  })
  it('should return an enpty list if cache is expired', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
  it('should return an enpty list if cache is on expiration date', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
  it('should return an empty list if cache is empty', async () => {
    const currentDate = new Date()
    const timestamp = new Date(currentDate)
    timestamp.setDate(timestamp.getDate() - 3)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
      value: [],
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
})
