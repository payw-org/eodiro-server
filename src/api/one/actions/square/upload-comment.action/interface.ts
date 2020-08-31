import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    accessToken: string
    postId: number
    body: string
  }
  payload: {
    err: OneApiError | 'No Body' | 'No Post'
  }
}
