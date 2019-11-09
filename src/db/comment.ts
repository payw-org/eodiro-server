import Db from '@/db'
import User from '@/db/user'
import Time from '@/modules/time'

export interface CommentModel {
  id: number
  post_id: number
  content: string
  uploaded_at: string
  user_id: number
  likes: number
  random_nickname: string
}

export interface CommentNew {
  postId: number
  body: string
}

export default class Comment {
  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  static async add(userId: number, commentData: CommentNew): Promise<boolean> {
    if (!this.isValidBody(commentData.body)) {
      return false
    }

    const userInfo = await User.findAtId(userId)

    if (!userInfo) {
      return false
    }

    const query = `
      insert into comment
      (user_id, random_nickname, post_id, body, uploaded_at)
      values (?, ?, ?, ?, ?)
    `
    const values = [
      userInfo.id,
      userInfo.random_nickname,
      commentData.postId,
      commentData.body,
      Time.getCurrTime()
    ]
    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err.stack)
      return false
    }

    return true
  }
}
