import { DBSchema } from '../../db-schema'

export interface FetchPostsOfBoard {
  action: 'fetchPostsOfBoard'
  data: {
    boardID: number
    fromID?: number
    offset?: number
    amount?: number
  }
  payload: DBSchema.Post[]
}
