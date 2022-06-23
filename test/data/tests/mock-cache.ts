import { SavePurchases } from '@/domain/use-cases'
import { CacheStore } from '../protocols/cache'

export class CacheStoreSpy implements CacheStore {
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
