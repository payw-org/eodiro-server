import { OneApiError } from '../../types/utils'

export interface Action {
  data: {
    boardName: string
  }
  payload: {
    err: OneApiError | 'No Board'
    data: number
  }
}
