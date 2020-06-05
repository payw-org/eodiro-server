import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'

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
