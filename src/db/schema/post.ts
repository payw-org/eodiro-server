export interface Post {
  id: number
  title: string
  body: string
  user_id: number
  uploaded_at: string
  likes: number
  is_edited: number
  random_nickname: string
}

export const postFields: (keyof Post)[] = [
  'id',
  'title',
  'body',
  'user_id',
  'uploaded_at',
  'likes',
  'is_edited',
  'random_nickname',
]

export const trimmedPostFields: (keyof Post | string)[] = [
  'id',
  'title',
  'SUBSTRING(body, 1, 100) as body',
  'user_id',
  'uploaded_at',
  'likes',
  'is_edited',
  'random_nickname',
]
