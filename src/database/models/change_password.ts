import Db, { MysqlInsertOrUpdateResult } from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'
import { TableNames } from '../table-names'

class ChangePassword extends Model {
  static async findWithUserId(userId: number): Promise<ChangePasswordType> {
    const sqlB = SqlB<ChangePasswordType>()
    const query = sqlB
      .select('*')
      .from(TableNames.change_password)
      .where(sqlB.equal('user_id', userId))
      .build()
    const [err, results] = await Db.query(query)

    if (err) {
      return undefined
    }

    return results.length > 0 ? results[0] : undefined
  }

  /**
   *
   * @param token
   * @returns `false`: server error
   */
  static async findWithToken(
    token: string
  ): Promise<ChangePasswordType | false> {
    const query = SqlB<ChangePasswordType>()
      .select('*')
      .from(TableNames.change_password)
      .where()
      .equal('token', token)
      .build()
    const [err, results] = await Db.query(query)

    if (err) {
      return false
    }

    return results.length > 0 ? results[0] : false
  }

  /**
   * Insert a new password change request.
   * Override with a new request if previous request exists.
   *
   * @returns Return token. Return `undefined` for server db error.
   */
  static async createOrUpdateToken(userId: number): Promise<string> {
    // TODO: use SqlB. New feature required: REPLACE INTO
    const query = `
      REPLACE INTO change_password
      SET token = ?, user_id = ?, requested_at = ?
    `
    const token = Auth.generateToken()
    const values = [token, userId, Time.getCurrTime()]
    const [err] = await Db.query<MysqlInsertOrUpdateResult>(query, values)

    if (err) {
      return undefined
    }

    return token
  }

  static async deleteWithToken(token: string): Promise<boolean> {
    const query = SqlB<ChangePasswordType>()
      .delete()
      .from(TableNames.change_password)
      .where()
      .equal('token', token)
      .build()
    const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(query)
    if (err || results.affectedRows === 0) {
      return false
    }
    return true
  }
}

export const changePassword = createModelFunction(
  ChangePassword,
  'change_password',
  {
    token: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ['token'],
      },
    ],
  }
)

export type ChangePasswordType = {
  token: string
  user_id: number
  requested_at: string
}
