import { DBSchema } from '../../db-schema'

export interface FetchPostsOfBoard {
  action: 'fetchPostsOfBoard'
  data: {
    boardID: number
    lastPostID?: number
    amount?: number
    noBody?: boolean
  }
  payload: (DBSchema.Post & { comment_count: number })[]
}
