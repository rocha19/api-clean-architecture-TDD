import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/use-cases";

export class LocalSabePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete('purchases')
    this.cacheStore.insert('purchases', purchases)
  }
}
