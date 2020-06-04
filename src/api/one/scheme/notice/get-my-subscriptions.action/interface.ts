import { OneApiError, OnlyAuth } from '@/api/one/scheme/types/utils'

export interface Action {
  data: OnlyAuth
  payload: {
    err: OneApiError
    data: {
      subscriptions: string[]
    }
  }
}
