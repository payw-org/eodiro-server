import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    tipCommentId: number
  }>
  payload: {
    err: OneApiError
    data: boolean
  }
}
