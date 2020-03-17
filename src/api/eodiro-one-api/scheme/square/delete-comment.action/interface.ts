import { OneAPIError } from '../../types/utils'

export interface Interface {
  data: {
    accessToken: string
    commentId: number
  }
  payload: {
    err: OneAPIError<void>
  }
}
