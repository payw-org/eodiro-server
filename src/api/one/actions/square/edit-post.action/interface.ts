import { OneApiError } from '@/api/one/types'
import { UploadPost } from '../upload-post'

export interface Action {
  data: {
    accessToken: string
    postId: number
    title: string
    body: string
    fileIds: number[]
  }
  payload: {
    err: OneApiError | UploadPost['payload']['err']
  }
}
