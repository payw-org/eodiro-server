import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    tipId: number
    body: string
  }>
  payload: {
    err: OneApiError
    data: {
      tipCommentId: number
    }
  }
}
