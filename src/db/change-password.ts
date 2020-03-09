import Time from '@/modules/time'
import Db, { MysqlInsertOrUpdateResult } from '.'
import { ChangePasswordModel } from './models'

export default class ChangePassword {
  static async findWithUserId(
    userId: number
  ): Promise<ChangePasswordModel | false> {
    const query = `
            select *
            from change_password
            where user_id = ?
        `
    const [err, results] = await Db.query(query, [userId])

    if (err) {
      return false
    }

    return results.length > 0 ? results[0] : false
  }

  static async findWithTempKey(
    tempKey: string
  ): Promise<ChangePasswordModel | false> {
    const query = `
            select *
            from change_password
            where temp_key = '${tempKey}'
      `
    const [err, results] = await Db.query(query)
    if (err) {
      return false
    }
    return results.length > 0 ? results[0] : false
  }

  static async createOrUpdateTempKey(
    userId: number,
    tempKey: string
  ): Promise<boolean> {
    const query = `
      REPLACE INTO change_password
      SET temp_key = ?, user_id = ?, created_at = ?
      `
    const values = [tempKey, userId, Time.getCurrTime()]
    const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(
      query,
      values
    )
    if (err) {
      return false
    }
    return true
  }
  static async deleteWidthTempKey(tempKey: string): Promise<boolean> {
    const query = `
        delete from change_password
        where temp_key = ${tempKey}
      `
    const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(query)
    if (err || results.affectedRows === 0) {
      return false
    }
    return true
  }
}
