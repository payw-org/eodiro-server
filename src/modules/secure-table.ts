import { isPrimitive } from './utils/is-primitive'

export function secureTable<Obj = any>(obj: Obj, userId: number): Obj {
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (key === 'userId') {
      obj['isMine'] = val === userId
      delete obj[key]
    } else if (key === 'isDeleted') {
      delete obj[key]
    } else if (!isPrimitive(val)) {
      secureTable(val, userId)
    }
  }

  return obj
}
