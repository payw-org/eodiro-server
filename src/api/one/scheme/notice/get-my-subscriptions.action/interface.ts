import { AuthOnly, OneApiError } from '@/api/one/scheme/types/utils'

export interface Action {
  data: AuthOnly
  payload: {
    err: OneApiError
    data: {
      subscriptions: string[]
    }
  }
}
