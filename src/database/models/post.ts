import Db from '@/db'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'
import { CommentType } from './comment'
import { user } from './user'

export interface PostNew {
  title: string
  body: string
}

export interface PostUpdate {
  postId: number
  title: string
  body: string
}

export const postAttrs = [
  'id',
  'board_id',
  'title',
  'body',
  'user_id',
  'random_nickname',
  'likes',
  'uploaded_at',
  'edited_at',
]

class Post extends Model {
  /**
   * Return posts equal or smaller than the given post id with the number of given amount
   */
  static async getPosts(
    fromId?: number,
    quantity = 20
  ): Promise<PostType[] | false> {
    if (!quantity) {
      quantity = 20
    }

    const sqlBInstance = SqlB()
      .select(
        ...postAttrs,
        SqlB()
          .select('count(*)')
          .from('comment')
          .where('comment.post_id = post.id')
          .as('comment_count')
          .build()
      )
      .from('post')

    if (fromId) {
      sqlBInstance.where(`id <= ${fromId}`)
    }

    sqlBInstance.order('id', 'desc').limit(quantity)

    const query = sqlBInstance.build()
    const [err, results] = await Db.query(query)

    if (err) {
      return false
    }

    return results as PostType[]
  }

  static async getRecentPosts(fromId: number): Promise<PostType[] | false> {
    const query = SqlB()
      .select(
        ...postAttrs,
        SqlB()
          .select('count(*)')
          .from('comment')
          .where('comment.post_id = post.id')
          .as('comment_count')
          .build()
      )
      .from('post')
      .where('id >= ?')
      .order('id', 'DESC')
      .build()
    const values = [fromId]
    const [err, results] = await Db.query(query, values)

    if (err) {
      return false
    }

    return results as PostType[]
  }

  /**
   * Returns a single post item
   */
  static async getFromId(postId: number): Promise<PostType | false> {
    const query = `
      select * from post
      where id = ?
    `
    const [err, results] = await Db.query(query, postId)

    if (err) {
      return false
    }

    if (results.length === 0) {
      return undefined
    }

    return results[0]
  }

  /**
   * Returns the given number of comments data associated to the given post id
   */
  static async getCommentsOf(
    postId: number,
    fromId = 0,
    quantity = 20
  ): Promise<CommentType[] | false> {
    if (typeof postId !== 'number') {
      console.error('Wrong postId data')
      return false
    }

    const query = `
      select *
      from comment
      where post_id = ?
      and id >= ?
      order by id asc
      limit ?
    `
    const values = [postId, fromId, quantity]

    const [err, results] = await Db.query(query, values)

    if (err) {
      return false
    }

    return results as CommentType[]
  }

  static isValidTitle(title: string): boolean {
    return title.length > 0
  }

  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  /**
   * Upload a new post and return its id.
   */
  static async upload(
    userId: number,
    postData: PostNew
  ): Promise<false | number> {
    // Verify and purify data

    const title = postData.title.trim()
    const body = postData.body.trim()

    if (!this.isValidTitle(title) || !this.isValidBody(body)) {
      return false
    }

    const query = SqlB()
      .insert('post', {
        title: undefined,
        body: undefined,
        user_id: undefined,
        uploaded_at: undefined,
        random_nickname: undefined,
      })
      .build()

    const User = await user()
    const userInfo = await User.findAtId(userId)

    if (!userInfo) {
      return false
    }

    // Pass trimmed title and body
    const values = [
      title,
      body,
      userId,
      Time.getCurrTime(),
      userInfo.random_nickname,
    ]
    const [err, results] = await Db.query(query, values)

    if (err) {
      return false
    }

    return (results as Record<string, any>).insertId
  }

  static async updatePost(refinedData: PostUpdate): Promise<boolean> {
    const query = `
      update post
      set title = ?, body = ?, is_edited = 1
      where id = ?
    `
    const values = [refinedData.title, refinedData.body, refinedData.postId]

    const [err] = await Db.query(query, values)

    if (err) {
      return false
    }

    return true
  }

  static async delete(postId: number): Promise<boolean> {
    const query = `
      delete from post
      where id = ?
    `

    const [err] = await Db.query(query, postId)

    if (err) {
      return false
    }

    return true
  }

  static async isOwnedBy(postId: number, userId: number): Promise<boolean> {
    const query = `
      select user_id
      from post
      where id = ?
    `

    const [err, results] = await Db.query(query, postId)

    if (err) {
      return false
    }

    // Post not found
    if (results.length === 0) {
      return false
    }

    const post: PostType = results[0]

    return post.user_id === userId
  }
}

export const post = createModelFunction(Post, 'post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'board',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
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
  random_nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
})

export type PostType = {
  id: number
  board_id: number
  title: string
  body: string
  user_id: number
  random_nickname: string
  likes: number
  uploaded_at: string
  edited_at: string
}
