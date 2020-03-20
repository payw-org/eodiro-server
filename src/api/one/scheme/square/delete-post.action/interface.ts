import { OneApiError } from '../../types/utils'

export interface Interface {
  data: {
    accessToken: string
    postId: number
  }
  payload: {
    err: OneApiError
  }
}
