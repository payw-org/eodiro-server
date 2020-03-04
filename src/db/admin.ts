import Db from '@/db'

export default class Admin {
  static async isAdmin(userId: number): Promise<boolean> {
    const query = `
        SELECT *
        FROM admin
        WHERE user_id = ?
    `
    const [, results] = await Db.query(query, userId)
    if (results.length === 1) {
      return true
    }

    return false
  }
}
