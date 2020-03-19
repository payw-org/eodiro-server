import Db from '@/db'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'
import { user } from './user'

export interface NewComment {
  postId: number
  body: string
}

class Comment extends Model {
  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  static async add(userId: number, commentData: NewComment): Promise<boolean> {
    if (!this.isValidBody(commentData.body)) {
      return false
    }

    const User = await user()
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
      Time.getCurrTime(),
    ]
    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err.stack)
      return false
    }

    return true
  }
}

export const comment = createModelFunction(Comment, 'comment', {
  id: PrimaryAIAttribute,
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  likes: {
    type: DataTypes.MEDIUMINT,
    defaultValue: 0,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  random_nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
})

export type CommentType = {
  id: number
  body: string
  uploaded_at: string
  user_id: number
  likes: number
  post_id: number
  random_nickname: string
}
