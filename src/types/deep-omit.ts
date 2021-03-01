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

export type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>
}

export type DeepOmit<T, K> = T extends Primitive
  ? T
  : T extends any[]
  ? DeepOmit<Unpacked<T>, K>[]
  : T extends Record<string, any>
  ? {
      [P in Exclude<keyof T, K>]: DeepOmit<T[P], K>
    }
  : T
