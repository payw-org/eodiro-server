import { OneAPIError } from '../../types/utils'

export interface Action {
  data: {
    accessToken: string
    postId: number
    body: string
  }
  payload: {
    err: OneAPIError<'No Body' | 'No Post'>
  }
}
