import { Comments } from '../../../db-schema/generated'
import { OneAPIError } from '../../types/utils'

export interface GetCommentsOfPost {
  action: 'getCommentsOfPost'
  data: {
    postId: number
    mostRecentCommentId?: number
    amount?: number
  }
  payload: {
    err: OneAPIError<void>
    data: Comments
  }
}
