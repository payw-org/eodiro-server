import { OneApiError } from '../../types/utils'

export interface Interface {
  data: {
    boardName: string
  }
  payload: {
    err: OneApiError | 'No Board'
    data: number
  }
}
