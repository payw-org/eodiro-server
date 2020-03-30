import { OneApiError } from '../../types/utils'

export interface Action {
  data: {
    accessToken: string
    postId: number
  }
  payload: {
    err: OneApiError
  }
}
