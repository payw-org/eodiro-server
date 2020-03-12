import { DBSchema } from '../../db-schema'

/**
 * Fetch recetly updated new posts
 */
export interface FetchRecentPostsOfBoard {
  action: 'fetchRecentPostsOfBoard'
  data: {
    boardID: number
    mostlyRecentPostID: number
  }
  payload: DBSchema.Post[]
}
