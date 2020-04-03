import Db, { MysqlResult } from '@/db'
import { Payload } from '@/modules/jwt'
import { RefreshToken as JwtRefreshToken } from '@/modules/jwt/tokens'
import { DataTypes, Model } from 'sequelize'
import { createInitModel } from '../create-init-model'

class RefreshToken extends Model {
  static async findWithUserId(
    userId: number
  ): Promise<RefreshTokenType | false> {
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
    refreshToken: JwtRefreshToken<Payload>
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
    refreshToken: JwtRefreshToken<Payload>
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

export const refreshToken = createInitModel(RefreshToken, 'refresh_token', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  manually_changed_at: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
})

export type RefreshTokenType = {
  user_id: number
  token: string
  manually_changed_at: number
}
