import Db from '@/db'
import SqlB, { Q } from '@/modules/sqlb'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'
import { eodiroQuery, EodiroQueryType } from '../eodiro-query'
import { query, QueryTypes } from '../query'
import { TableNames } from '../table-names'
import { CommentType } from './comment'
import { PostLike, PostLikeAttrs } from './post_like'
import { getUser } from './user'

export interface PostNew {
  title: string
  body: string
}

export interface PostUpdate {
  postId: number
  title: string
  body: string
}

/**
 * @deprecated Use `Object.keys()`
 */
export const postAttrs = [
  'id',
  'board_id',
  'title',
  'body',
  'user_id',
  'random_nickname',
  'uploaded_at',
  'edited_at',
]

export type PostAttrs = {
  id: number
  board_id: number
  title: string
  body: string
  user_id: number
  random_nickname: string
  uploaded_at: string
  edited_at: string
}

export type CommentCount = {
  comment_count: number
}
export type PostAttrsWithCommentCount = PostAttrs & CommentCount

export class Post extends Model {
  static tableName = 'post'
  static attrs = {
    id: 'id',
    board_id: 'board_id',
    title: 'title',
    body: 'body',
    user_id: 'user_id',
    random_nickname: 'random_nickname',
    uploaded_at: 'uploaded_at',
    edited_at: 'edited_at',
  }

  static async isLikedBy(postId: number, userId: number) {
    const result = await eodiroQuery(
      Q<PostLikeAttrs>()
        .select('*')
        .from(PostLike.tableName)
        .where()
        .equal('post_id', postId)
        .andEqual('user_id', userId)
    )

    return result.length > 0
  }

  static async like(postId: number, userId: number) {
    await eodiroQuery(
      Q<PostLikeAttrs>().insert(PostLike.tableName, {
        user_id: userId,
        post_id: postId,
      }),
      EodiroQueryType.INSERT
    )
  }

  static async unlike(postId: number, userId: number) {
    await eodiroQuery(
      Q<PostLikeAttrs>()
        .delete()
        .from(PostLike.tableName)
        .where()
        .equal('post_id', postId)
        .andEqual('user_id', userId)
    )
  }

  static async getLikes(postId: number) {
    const result = await eodiroQuery<PostAttrs>(
      Q<PostLikeAttrs>()
        .select('*')
        .from(PostLike.tableName)
        .where()
        .equal('post_id', postId)
    )

    return result.length
  }

  /**
   * Return posts equal or smaller than the given post id with the number of given amount
   */
  static async getPosts(
    fromId?: number,
    quantity = 20
  ): Promise<PostAttrs[] | false> {
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

    return results as PostAttrs[]
  }

  static async getRecentPosts(fromId: number): Promise<PostAttrs[] | false> {
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

    return results as PostAttrs[]
  }

  /**
   * Returns a single post item
   */
  static async getFromId(postId: number): Promise<PostAttrs | false> {
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
      .insert(TableNames.post, {
        title: undefined,
        body: undefined,
        user_id: undefined,
        uploaded_at: undefined,
        random_nickname: undefined,
      })
      .build()

    const User = await getUser()
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
    const result = await query<PostAttrs>(
      SqlB<PostAttrs>()
        .select('*')
        .from('post')
        .where()
        .equal('id', postId)
        .andEqual('user_id', userId),
      {
        type: QueryTypes.SELECT,
        plain: true,
      }
    )

    return !!result
  }
}

export const initPost = createInitModelFunction(Post, 'post', {
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
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
})
