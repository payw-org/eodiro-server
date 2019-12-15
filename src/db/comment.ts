import Db from '@/db'
import User from '@/db/user'
import Time from '@/modules/time'
import { NewComment } from '@/db/models'

export default class Comment {
  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  static async add(userId: number, commentData: NewComment): Promise<boolean> {
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
