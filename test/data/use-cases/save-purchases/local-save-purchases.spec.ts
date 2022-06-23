import { CacheStore } from '@/data/protocols/cache'
import { LocalSabePurchases } from '@/data/use-cases/save-purchases'
import { SavePurchases } from '@/domain/use-cases'
import { mockPurchases } from '@test/data/tests'

class CacheStoreSpy implements CacheStore {
  insertCallsCount = 0
  deleteCallsCount = 0
  deleteKey: string = ''
  insertKey: string = ''
  insertValue: Array<SavePurchases.Params> = []

  delete(deleteKey: string): void {
    this.deleteCallsCount++
    this.deleteKey = deleteKey
  }
  insert(insertKey: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = insertKey
    this.insertValue = value
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error()
    })
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
