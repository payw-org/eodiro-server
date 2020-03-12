import { FetchCommentsOfPost } from './fetch-comments-of-post'
import { FetchPostsOfBoard } from './fetch-posts-of-board'
export * from './fetch-comments-of-post'
export * from './fetch-posts-of-board'

export type SquareAPIScheme = FetchCommentsOfPost | FetchPostsOfBoard
