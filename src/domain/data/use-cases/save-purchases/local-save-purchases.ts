import { CacheStore } from '@/data/protocols/cache'

export class LocalSabePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
  async save(): Promise<void> {
    this.cacheStore.delete('purchases')
  }
}
