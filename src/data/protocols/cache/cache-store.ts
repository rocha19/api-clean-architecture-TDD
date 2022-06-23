export interface CacheStore {
  delete: (key: string) => void
}
// export interface CacheStore<T> {
//   delete(key: string): void
//   insert(key: string, value: T): void
// }
