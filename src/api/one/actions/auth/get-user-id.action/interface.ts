import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    accessToken: string
  }
  payload: {
    err: OneApiError
    data: {
      userId: number
    }
  }
}
