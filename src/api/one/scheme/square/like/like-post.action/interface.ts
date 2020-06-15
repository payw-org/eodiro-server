import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    postId: number
  }>
  payload: {
    err: OneApiError
    /** Total likes amount */
    data: {
      liked: boolean
      total: number
    }
  }
}
