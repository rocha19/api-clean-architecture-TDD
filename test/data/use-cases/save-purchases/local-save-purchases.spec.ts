import { CacheStore } from '@/data/protocols/cache'
import { LocalSabePurchases } from '@/data/use-cases/save-purchases'

class CacheStoreSpy implements CacheStore {
  insertCallsCount = 0
  deleteCallsCount = 0
  deleteKey: string = ''
  insertKey: string = ''

  delete(deleteKey: string): void {
    this.deleteCallsCount++
    this.deleteKey = deleteKey
  }
  insert(insertKey: string): void {
    this.insertCallsCount++
    this.insertKey = insertKey
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
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })
  it('should not insert new cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()
    // jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
    //   throw new Error()
    // })
    const promise = sut.save()
    // expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow
  })
  it('should not insert new cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
  })
})
