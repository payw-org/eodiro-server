import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    accessToken: string
    postId: number
  }
  payload: {
    err: OneApiError
  }
}
