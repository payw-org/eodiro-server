import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    tipId: number
  }>
  payload: {
    err: OneApiError
    data: {
      isBookmarked: boolean
    }
  }
}
