import { PostType } from '@/database/models/post'

export interface FetchPostsOfBoard {
  action: 'fetchPostsOfBoard'
  data: {
    boardID: number
    lastPostID?: number
    amount?: number
    noBody?: boolean
  }
  payload: (PostType & { comment_count: number })[]
}
