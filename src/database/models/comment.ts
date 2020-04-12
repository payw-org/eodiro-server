import Db from '@/db'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'
import { PrimaryAIAttribute } from '../utils/model-attributes'
import { getUser } from './user'

export interface NewComment {
  postId: number
  body: string
}

export type CommentAttrs = {
  id: number
  body: string
  uploaded_at: string
  user_id: number
  post_id: number
  random_nickname: string
}

export class Comment extends Model {
  static tableName = 'comment'
  static attrs = {
    id: 'id',
    body: 'body',
    uploaded_at: 'uploaded_at',
    user_id: 'user_id',
    post_id: 'post_id',
    random_nickname: 'random_nickname',
  }

  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  static async add(userId: number, commentData: NewComment): Promise<boolean> {
    if (!this.isValidBody(commentData.body)) {
      return false
    }

    const User = await getUser()
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

export const comment = createInitModelFunction(Comment, 'comment', {
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
