import { DBSchema } from '../../db-schema'

export interface FetchPostsOfBoard {
  request: {
    action: 'fetchPostsOfBoard'
    data: {
      boardID: number
      offset?: number
      amount?: number
    }
  }
  payload: DBSchema.Post[]
}
