import { PostType } from '@/database/models/post'

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
  payload: PostType[]
}
