import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    deviceId: string
    pushToken: string
  }>
  payload: {
    err: OneApiError
    errMeta?: any
  }
}
