export interface CommentModel {
  id: number
  post_id: number
  content: string
  uploaded_at: string
  user_id: number
  likes: number
  random_nickname: string
}

export interface NewComment {
  postId: number
  body: string
}
