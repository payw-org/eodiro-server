import { AuthOnly, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthOnly
  payload: {
    err: OneApiError
    data: { [key: string]: string }
  }
}
