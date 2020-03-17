import { OneAPIError } from '../../types/utils'

export interface Interface {
  data: {
    accessToken: string
    postId: number
    body: string
  }
  payload: {
    err: OneAPIError<'No Body'>
  }
}
