import { OneApiError } from '@/api/one/types'

export interface Action {
  data: {
    boardName: string
  }
  payload: {
    err: OneApiError | 'No Board'
    data: number
  }
}
