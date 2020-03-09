import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import Db, { MysqlInsertOrUpdateResult } from '.'
import { DbTables } from './constants'
import { ChangePasswordModel } from './models'

export default class ChangePassword {
  static async findWithUserId(userId: number): Promise<ChangePasswordModel> {
    const sqlB = SqlB<ChangePasswordModel>()
    const query = sqlB
      .select('*')
      .from(DbTables.change_password)
      .where(sqlB.equal('user_id', userId))
      .build()
    const [err, results] = await Db.query(query)

    if (err) {
      return undefined
    }

    return results.length > 0 ? results[0] : undefined
  }

  static async findWithToken(
    token: string
  ): Promise<ChangePasswordModel | false> {
    const query = SqlB<ChangePasswordModel>()
      .select('*')
      .from(DbTables.change_password)
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
    const query = SqlB<ChangePasswordModel>()
      .delete()
      .from(DbTables.change_password)
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
