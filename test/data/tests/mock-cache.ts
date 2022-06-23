import { SavePurchases } from '@/domain/use-cases'
import { CacheStore } from '../protocols/cache'

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Message> = []
  deleteKey: string = ''
  insertKey: string = ''
  insertValue: Array<SavePurchases.Params> = []

  delete(deleteKey: string): void {
    this.messages.push(CacheStoreSpy.Message.delete)
    this.deleteKey = deleteKey
  }
  insert(insertKey: string, value: any): void {
    this.messages.push(CacheStoreSpy.Message.insert)
    this.insertKey = insertKey
    this.insertValue = value
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete)
      throw new Error()
    })
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert)
      throw new Error()
    })
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert
  }
}
