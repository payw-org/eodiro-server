import { BoardType } from '@/database/models/board'
import { PostType } from '@/database/models/post'
import { AuthRequired, OneApiError } from '../../types/utils'

export interface Action {
  data: AuthRequired<{
    /** @default 0 */
    lastPostId?: number
    /** @default Infinity */
    amount?: number
  }>
  payload: {
    err: OneApiError
    data?: (PostType & BoardType)[]
  }
}
