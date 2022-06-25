import { LocalLoadPurchases } from '@/data/use-cases/load-purchases'
import {
  CacheStoreSpy,
  getCacheExpirationDate,
  mockPurchases,
} from '@test/data/tests'

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
  it('should delete cache if load fails', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    sut.validate()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])
    expect(cacheStore.deleteKey).toBe('purchases')
  })
  it('should has no side effect if liad success', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
    }
    sut.validate
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })






  it('should delete cache if its expired', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
    }
    sut.validate()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
  })
  it('should delete cache if its on expiration date', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    const { cacheStore, sut } = makeSut(currentDate)
    cacheStore.fetchResult = {
      timestamp,
    }
    sut.validate()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
  })
})