import Db, { MysqlResult } from '@/db'
import { Payload } from '@/modules/jwt'
import { RefreshToken } from '@/modules/jwt/tokens'

export interface RefreshTokenModel {
  user_id: number
  token: string
  manually_changed_at: number
}

export default class RefreshTokenTable {
  static async findWithUserId(
    userId: number
  ): Promise<RefreshTokenModel | false> {
    const query = `
      SELECT *
      FROM refresh_token
      WHERE user_id = ${userId}
    `
    const [err, results] = await Db.query(query)
    if (err) {
      console.error(err.message)
      return false
    }

    if (results.length === 0) {
      return undefined
    }
    return results[0]
  }

  static async addRefreshToken(
    refreshToken: RefreshToken<Payload>
  ): Promise<MysqlResult | false> {
    const query = `
      insert into refresh_token
      (user_id, token, manually_changed_at)
      values (${refreshToken.decoded.payload.userId},'${refreshToken.token}',${refreshToken.decoded.iat})
    `
    const [err, results] = await Db.query(query)
    if (err) {
      console.error(err.message)
      return false
    }

    if (results.length === 0) {
      return undefined
    }
    return results
  }

  static async updateRefreshToken(
    refreshToken: RefreshToken<Payload>
  ): Promise<MysqlResult | false> {
    const query = `
      UPDATE refresh_token
      SET token = '${refreshToken.token}'
      WHERE user_id = ${refreshToken.decoded.payload.userId}
    `
    const [err, results] = await Db.query(query)
    if (err) {
      console.error(err.message)
      return false
    }

    if (results.length === 0) {
      return undefined
    }
    return results
  }

  /**
   * Deletes refresh token from database
   */
  static async deleteRefreshToken(
    userId: number
  ): Promise<MysqlResult | false> {
    const query = `
      DELETE FROM refresh_token
      WHERE user_id = ${userId}
    `
    const [err, results] = await Db.query(query)
    if (err) {
      console.error(err.message)
      return false
    }

    if (results.length === 0) {
      return undefined
    }
    return results
  }
}
