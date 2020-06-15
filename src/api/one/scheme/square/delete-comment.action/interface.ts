import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    accessToken: string
    commentId: number
  }
  payload: {
    err: OneApiError
  }
}
