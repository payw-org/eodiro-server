import { PostType } from '../../../../database/models/post'
import { AuthRequired, OneApiError } from '../types/utils'

export interface GetPostById {
  action: 'getPostById'
  data: AuthRequired<{
    postID: number
    edit?: boolean
  }>
  payload: {
    err: OneApiError
    data: PostType
  }
}
