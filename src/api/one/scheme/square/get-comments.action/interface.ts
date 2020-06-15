import { CommentAttrs } from '@/database/models/comment'
import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    accessToken: string
    postId: number
    mostRecentCommentId?: number
    amount?: number
  }
  payload: {
    err: OneApiError
    data: CommentAttrs[]
  }
}
