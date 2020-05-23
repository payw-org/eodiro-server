import { OneApiError } from '@/api/one/scheme/types/utils'

export interface Action {
  data: {
    userId: number
    deviceId: string
    pushToken: string
  }
  payload: {
    err: OneApiError
    errMeta?: any
  }
}
