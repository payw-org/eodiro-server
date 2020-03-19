import { CommentType } from '../../../../../database/models/comment'
import { OneAPIError } from '../../types/utils'

export interface Interface {
  data: {
    accessToken: string
    postId: number
    mostRecentCommentId?: number
    amount?: number
  }
  payload: {
    err: OneAPIError<void>
    data: CommentType[]
  }
}
