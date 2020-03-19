import { OneAPIError } from '../../types/utils'

export interface Interface {
  data: {
    boardName: string
  }
  payload: {
    err: OneAPIError<'No Board'>
    data: number
  }
}
