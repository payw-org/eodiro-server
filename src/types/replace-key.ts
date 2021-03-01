import { Unpacked } from './unpacked'

type Primitive =
  | string
  | number
  | boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
  | symbol
  | undefined
  | null
  | Date

export type ReplaceKey<T, K, A, D = T & A> = T extends Primitive
  ? T
  : T extends any[]
  ? ReplaceKey<Unpacked<T>, K, A>[]
  : T extends Record<string, any>
  ? {
      [P in Exclude<keyof D, K>]: ReplaceKey<D[P], K, A>
    }
  : T

type A = {
  nested: {
    included: {
      a: string
      b: number
    }
    excluded: {
      c: string
      d: number
    }
  }
  nestedArray: {
    included: {
      a: string
      b: number
    }
    excluded: {
      c: string
      d: number
    }
  }[]
}

const a = [
  {
    included: 'hello',
    excluded: 'world',
  },
]

type AA = ReplaceKey<typeof a, 'excluded', { what: boolean }>
