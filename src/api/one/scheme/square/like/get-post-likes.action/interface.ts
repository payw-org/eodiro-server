import { OneApiError } from '@/api/one/scheme/types/utils'

export interface Action {
  data: {
    postId: number
  }
  payload: {
    err: OneApiError
    data: number
  }
}
