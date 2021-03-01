import { DeepOmit } from '@/types/deep-omit'
import { ReplaceKey } from '@/types/replace-key'
import { isPrimitive } from './utils/is-primitive'

export function secureTable<T = any>(
  obj: T,
  userId: number
): ReplaceKey<DeepOmit<T, 'isDeleted'>, 'userId', { isMine: boolean }> {
  for (const key of Object.keys(obj)) {
    const objObj = (obj as unknown) as Record<string, unknown>
    const val = objObj[key]
    if (key === 'userId') {
      objObj['isMine'] = val === userId
      delete objObj[key]
    } else if (key === 'isDeleted') {
      delete objObj[key]
    } else if (!isPrimitive(val)) {
      secureTable(val, userId)
    }
  }

  return obj as ReplaceKey<
    DeepOmit<T, 'isDeleted'>,
    'userId',
    { isMine: boolean }
  >
}
