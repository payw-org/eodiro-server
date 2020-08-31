import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    postId: number
  }>
  payload: {
    err: OneApiError
    data: boolean
  }
}
