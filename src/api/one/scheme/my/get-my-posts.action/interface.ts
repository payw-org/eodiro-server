import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'
import { BoardType } from '@/database/models/board'
import { PostAttrs } from '@/database/models/post'

export interface Action {
  data: AuthRequired<{
    /** @default 0 */
    lastPostId?: number
    /** @default Infinity */
    amount?: number
  }>
  payload: {
    err: OneApiError
    data?: (PostAttrs & BoardType)[]
  }
}
