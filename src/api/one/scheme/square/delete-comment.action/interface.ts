import { OneApiError } from '../../types/utils'

export interface Action {
  data: {
    accessToken: string
    commentId: number
  }
  payload: {
    err: OneApiError
  }
}
