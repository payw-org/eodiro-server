import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    postId: number
  }
  payload: {
    err: OneApiError
    data: number
  }
}
