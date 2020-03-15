import { Post } from '../../db-schema/generated'
import { OneAPIError, RequireAuth } from '../types/utils'

export interface GetPostById {
  action: 'getPostById'
  data: RequireAuth<{
    postID: number
  }>
  payload: {
    err: OneAPIError<void>
    data: Post
  }
}
