import { DBSchema } from '../../db-schema'

/**
 * Fetch recetly updated new posts
 */
export interface FetchRecentPostsOfBoard {
  action: 'fetchRecentPostsOfBoard'
  data: {
    boardID: number
    mostRecentPostID: number
    noBody?: boolean
  }
  payload: DBSchema.Post[]
}
