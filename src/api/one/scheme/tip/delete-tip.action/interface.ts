import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'

export interface Action {
  data: AuthRequired<{
    tipId: number
  }>
  payload: {
    err: OneApiError
    data: boolean
  }
}
