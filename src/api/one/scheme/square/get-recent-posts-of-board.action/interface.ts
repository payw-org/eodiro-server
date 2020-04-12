import { OneApiError } from '@/api/one/scheme/types/utils'
import { PostAttrs } from '@/database/models/post'

/**
 * Fetch recetly updated new posts
 */
export interface Action {
  data: {
    boardId: number
    mostRecentPostId: number
    noBody?: boolean
    columns?: (keyof PostAttrs)[]
  }
  payload: {
    err: OneApiError
    data: (PostAttrs & { comment_count: number; likes: number })[]
  }
}
