import { OneAPIError } from '../../types/utils'

export interface Interface {
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
