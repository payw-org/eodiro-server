import Db from '@/db'

export interface CommentModel {
  id: number
  post_id: number
  content: string
  uploaded_at: string
  user_id: number
  likes: number
}

export interface CommentNew {
  postId: number
  userId: number
  body: string
}

export default class Comment {
  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  static async add(commentData: CommentNew): Promise<boolean> {
    if (!this.isValidBody(commentData.body)) {
      return false
    }

    const query = `
      insert into comment
      (post_id, user_id, body)
      values (?, ?, ?)
    `
    const values = [commentData.postId, commentData.userId, commentData.body]
    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err.message)
      return false
    }

    return true
  }
}
