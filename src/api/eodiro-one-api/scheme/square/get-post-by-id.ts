import { PostType } from '../../../../database/models/post'
import { OneAPIError, RequireAuth } from '../types/utils'

export interface GetPostById {
  action: 'getPostById'
  data: RequireAuth<{
    postID: number
  }>
  payload: {
    err: OneAPIError<void>
    data: PostType
  }
}
