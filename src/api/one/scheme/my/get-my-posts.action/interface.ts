import { BoardType } from '@/database/models/board'
import { PostType } from '@/database/models/post'
import { AuthRequired, OneApiError } from '../../types/utils'

export interface Action {
  data: AuthRequired<{
    /** @default 0 */
    lastPostId?: number
    /** @default 20 */
    amount?: number
  }>
  payload: {
    err: OneApiError
    posts?: (PostType & BoardType)[]
  }
}
