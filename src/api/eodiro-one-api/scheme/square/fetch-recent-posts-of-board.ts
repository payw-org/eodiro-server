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

export async function fetchRecentPostsOfBoard(
  data: FetchRecentPostsOfBoard['data']
): Promise<FetchRecentPostsOfBoard['payload']> {
  return
}
