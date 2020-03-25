import { PostType } from '../../../../database/models/post'
import { AuthRequired, OneApiError } from '../types/utils'

export interface GetPostById {
  action: 'getPostById'
  data: AuthRequired<{
    postId: number
    edit?: boolean
  }>
  payload: {
    err: OneApiError
    data: PostType & {
      files?: {
        mimeType: string
        name: string
        fileId: number
        path: string
      }[]
    }
  }
}
