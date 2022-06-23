import { SavePurchases } from '@/domain/use-cases'
import { CacheStore } from '../protocols/cache'

export class CacheStoreSpy implements CacheStore {
  actions: Array<CacheStoreSpy.Action> = []
  deleteKey: string = ''
  insertKey: string = ''
  insertValue: Array<SavePurchases.Params> = []

  delete(deleteKey: string): void {
    this.actions.push(CacheStoreSpy.Action.delete)
    this.deleteKey = deleteKey
  }
  insert(insertKey: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert)
    this.insertKey = insertKey
    this.insertValue = value
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete)
      throw new Error()
    })
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.Actions.push(CacheStoreSpy.Action.insert)
      throw new Error()
    })
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert
  }
}
