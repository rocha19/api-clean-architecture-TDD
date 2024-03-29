import { SavePurchases } from '@/domain/use-cases'
import { CacheStore } from '@/data/protocols/cache'

const maxAgeInDays = 3

export const getCacheExpirationDate = (timestamp: Date): Date => {
  const maxCacheAge = new Date(timestamp)
  maxCacheAge.setDate(timestamp.getDate() - maxAgeInDays)
  return maxCacheAge
}

export class CacheStoreSpy implements CacheStore {
  actions: Array<CacheStoreSpy.Action> = []
  deleteKey: string
  insertKey: string
  fetchKey: string
  insertValue: Array<SavePurchases.Params> = []
  fetchResult: any

  fetch(key: string): any {
    this.actions.push(CacheStoreSpy.Action.fetch)
    this.deleteKey = key
    return this.fetchResult
  }
  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete)
    this.fetchKey = key
  }
  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert)
    this.insertKey = key
    this.insertValue = value
  }
  replace(key: string, value: any): void {
    this.delete(key)
    this.insert(key, value)
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete)
      throw new Error()
    })
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.insert)
      throw new Error()
    })
  }
  simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.fetch)
      throw new Error()
    })
  }
}
export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert,
    fetch
  }
}
