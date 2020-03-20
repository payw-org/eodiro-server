import { PostType } from '../../../../database/models/post'
import { OneApiError, RequireAuth } from '../types/utils'

export interface GetPostById {
  action: 'getPostById'
  data: RequireAuth<{
    postID: number
    edit?: boolean
  }>
  payload: {
    err: OneApiError
    data: PostType
  }
}
