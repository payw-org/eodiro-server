import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'

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
