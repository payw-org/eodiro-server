import Db from '@/db'
import { CommentModel } from '@/db/models'
import Time from '@/modules/time'
import User from '@/db/user'
import SqlB from '@/modules/sqlb'

export interface PostModel {
  id: number
  title: string
  body: string
  user_id: number
  likes: number
  random_nickname: string
}

export interface PostNew {
  title: string
  body: string
}

export interface PostUpdate {
  postId: number
  title: string
  body: string
}

export default class Post {
  /**
   * Return posts equal or smaller than the given post id with the number of given amount
   */
  static async getPosts(
    fromId?: number,
    quantity = 20
  ): Promise<PostModel[] | false> {
    if (!quantity) {
      quantity = 20
    }

    let query = `
      select *,
      (
        select count(*)
        from comment
        where comment.post_id = post.id
      ) as comment_count
      from post
      order by id desc
      limit ?
    `
    let values = [quantity]

    if (fromId) {
      query = `
        select *,
        (
          select count(*)
          from comment
          where comment.post_id = post.id
        ) as comment_count
        from post
        where id <= ?
        order by id desc
        limit ?
      `
      values = [fromId, quantity]
    }

    const [err, results] = await Db.query(query, values)

    if (err) {
      console.error(err.stack)
      return false
    }

    return results as PostModel[]
  }

  static async getRecentPosts(fromId: number): Promise<PostModel[] | false> {
    const query = `
      select *,
      (
        select count(*)
        from comment
        where comment.post_id = post.id
      ) as comment_count
      from post
      where id >= ?
      order by id desc
    `
    const values = [fromId]
    const [err, results] = await Db.query(query, values)

    if (err) {
      console.error(err.stack)
      return false
    }

    return results as PostModel[]
  }

  /**
   * Returns a single post item
   */
  static async getFromId(postId: number): Promise<PostModel | false> {
    const query = `
      select * from post
      where id = ?
    `
    const [err, results] = await Db.query(query, postId)

    if (err) {
      console.error(err.message)
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
  ): Promise<CommentModel[] | false> {
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
      console.error(err.stack)
      return false
    }

    return results as CommentModel[]
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
        random_nickname: undefined
      })
      .build()

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
      userInfo.random_nickname
    ]
    const [err, results] = await Db.query(query, values)

    if (err) {
      console.error(err.message)
      return false
    }

    return (results as Record<string, any>).insertId
  }

  static async update(refinedData: PostUpdate): Promise<boolean> {
    const query = `
      update post
      set title = ?, body = ?, is_edited = 1
      where id = ?
    `
    const values = [refinedData.title, refinedData.body, refinedData.postId]

    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err)
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
      console.error(err.message)
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
      console.error(err.message)
      return false
    }

    // Post not found
    if (results.length === 0) {
      return false
    }

    const post: PostModel = results[0]

    return post.user_id === userId
  }
}
