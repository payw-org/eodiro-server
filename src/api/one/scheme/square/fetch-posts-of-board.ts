import { PostAttrs, PostAttrsWithCommentCount } from '@/database/models/post'

export interface FetchPostsOfBoard {
  action: 'fetchPostsOfBoard'
  data: {
    boardID: number
    lastPostID?: number
    amount?: number
    noBody?: boolean
    columns?: (keyof PostAttrs)[]
  }
  payload: PostAttrsWithCommentCount[]
}
