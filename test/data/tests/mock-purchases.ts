import { SavePurchases } from '@/domain/use-cases'
import { faker } from '@faker-js/faker'

export const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    value: faker.datatype.number(),
  },
  {
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    value: faker.datatype.number(),
  },
]
