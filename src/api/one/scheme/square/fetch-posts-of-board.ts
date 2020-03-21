import {
  PostType,
  PostTypeWithCommentCount,
} from '../../../../database/models/post'

export interface FetchPostsOfBoard {
  action: 'fetchPostsOfBoard'
  data: {
    boardID: number
    lastPostID?: number
    amount?: number
    noBody?: boolean
    columns?: (keyof PostType)[]
  }
  payload: PostTypeWithCommentCount[]
}
