import Db from '@/db'
import { CommentModel } from './comment'
import Time from '@/modules/time'

export interface PostModel {
  id: number
  title: string
  body: string
  user_id: number
  likes: number
}

export interface PostNew {
  title: string
  body: string
  userId: number
}

export interface PostUpdate {
  postId: number
  title: string
  body: string
}

export default class Post {
  /**
   * Returns all posts
   */
  static async getPosts(
    fromId: number,
    count: number
  ): Promise<PostModel[] | false> {
    const query = `
      select *
      from post
      where id >= ?
      order by id desc
      limit ?
    `

    const [err, results] = await Db.query(query, [fromId, count])

    if (err) {
      console.error(err.message)
      return false
    }

    return results
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
    fromId: number,
    count: number
  ): Promise<CommentModel[] | false> {
    const query = `
      select *
      from comment
      where post_id = ?
      and id >= ?
      order by desc
      limit ?
    `
    const values = [postId, fromId, count]

    const [err, results] = await Db.query(query, values)

    if (err) {
      console.error(err.message)
      return false
    }

    return results
  }

  static isValidTitle(title: string): boolean {
    return title.length > 0
  }

  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  /**
   * Upload a new post
   */
  static async upload(
    session: Express.Session,
    postData: PostNew
  ): Promise<boolean> {
    // Verify and purify data

    const title = postData.title.trim()
    const body = postData.body.trim()

    if (!this.isValidTitle(title) || !this.isValidBody(body)) {
      return false
    }

    const query = `
      insert into post
      (title, body, user_id, uploaded_at)
      values (?, ?, ?, ?)
    `
    const values = [
      postData.title,
      postData.body,
      postData.userId,
      Time.getCurrTime()
    ]
    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err.message)
      return false
    }

    return true
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
