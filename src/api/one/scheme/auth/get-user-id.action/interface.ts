import { OneAPIError } from '../../types/utils'

export interface Action {
  data: {
    accessToken: string
  }
  payload: {
    err: OneAPIError<void>
    data: {
      userId: number
    }
  }
}
