import { FetchCommentsOfPost } from './square/fetch-comments-of-post'
import { FetchPostsOfBoard } from './square/fetch-posts-of-board'
import { FetchRecentPostsOfBoard } from './square/fetch-recent-posts-of-board'
export { FetchCommentsOfPost } from './square/fetch-comments-of-post'
export { FetchPostsOfBoard } from './square/fetch-posts-of-board'
export { FetchRecentPostsOfBoard } from './square/fetch-recent-posts-of-board'

export type APIScheme =
  | FetchCommentsOfPost
  | FetchPostsOfBoard
  | FetchRecentPostsOfBoard
