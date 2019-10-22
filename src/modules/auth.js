const conn = require('@/modules/db-connector').getConnection()
const crypto = require('crypto')
const dayjs = require('dayjs')

class Auth {
  static hashPw(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('base64')
  }

  /**
   * @param {Express.Session} session
   */
  static async signIn(session, info) {
    const { portalId, password } = info

    if (!portalId) {
      return {
        err: 1
      }
    }

    if (!password) {
      return {
        err: 2
      }
    }

    const hashedPw = this.hashPw(password)

    const sql = `
      SELECT *
      FROM users
      WHERE portal_id = ? AND password = ?
    `
    const values = [portalId, hashedPw]
    const [results] = conn.execute(sql, values)

    return results
  }

  static async signUp(info) {
    const { portalId, password, nickname } = info

    if (!portalId) {
      return {
        err: 3
      }
    }

    if (!password) {
      return {
        err: 4
      }
    }

    const sql = `
      SELECT *
      FROM users
      WHERE portal_id = ?
    `
    const values = [portalId]
    const [results] = conn.execute(sql, values)

    if (results.length === 0) {
      // Available
      const sql = `
        INSERT INTO users_pending
        (portal_id, password, registered_at, nickname, random_nickname, token)
        VALUES (?, ?, ?, ?, "random nickname", ?)
      `
      const values = [
        portalId,
        this.hashPw(password),
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
        nickname,
        crypto.randomBytes(20).toString('hex')
      ]

      const [results] = conn.execute(sql, values)

      return results
    } else if (results.length === 1) {
      // There already exists a user with this portal ID
      return {
        err: 5
      }
    } else {
      // Fatal error: multiple fields for the same portal ID
      // Must be reviewed by the maintainers
      return {
        err: 7
      }
    }
  }

  /**
   * @param {Express.Session} session
   */
  static signOut(session) {
    session.destroy()
  }
}

module.exports = Auth
