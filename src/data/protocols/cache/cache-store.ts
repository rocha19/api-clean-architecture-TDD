// export interface CacheStore<T> {
//   delete(key: string): void
//   insert(key: string, value: T): void
// }
export interface CacheStore {
  delete: (key: string) => void
  insert(insertKey: string, value: any): void
}
