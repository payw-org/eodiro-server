const conn = require('@/modules/db-connector').getConnection()
const crypto = require('crypto')
const dayjs = require('dayjs')
const Mailer = require('@/modules/mailer')

class Auth {
  /**
   * @param {string} password
   */
  static hashPw(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('base64')
  }

  /**
   * @param {string} token
   */
  static async verifyPendingUser(token) {
    if (!token) {
      return {
        err: true,
        msg: 'no token given'
      }
    }
    const sql = `
      select *
      from pending_user
      where token = ?
    `
    const values = [token]

    /** @type {[Array<>]} */
    const queryResult = await conn.execute(sql, values).catch(err => {
      console.log(err)
    })
    if (!queryResult) {
      return {
        err: true,
        msg: 'query failed'
      }
    }

    const [results] = queryResult
    if (results.length !== 1) {
      return {
        err: true,
        msg: 'no token found from pending users'
      }
    }

    // Successfully verified
    // Auto login and redirect to main page or the previous page
    const pendingUserId = results[0].id
    const sql2 = `
      insert into user (portal_id, password, registered_at, nickname, random_nickname)
      select portal_id, password, registered_at, nickname, random_nickname
      from pending_user
      where id = ?;
      delete from pending_user
      where id = ?;
    `
    const values2 = [pendingUserId, pendingUserId]
    const queryResult2 = await conn.query(sql2, values2).catch(err => {
      console.log(err.message)
    })
    if (!queryResult2) {
      return {
        err: true,
        msg: 'query failed'
      }
    }

    return {
      err: false
    }
  }

  /**
   * @param {string} portalId
   */
  static validatePortalId(portalId) {
    const emailRegExp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    const portalIdRegExp = new RegExp(/@cau\.ac\.kr$/)
    if (!emailRegExp.exec(portalId) || !portalIdRegExp.exec(portalId)) {
      // Invalid
      return false
    } else {
      return true
    }
  }

  /**
   * @param {Express.Session} session
   * @param {Object} info
   * @param {string} info.portalId
   * @param {string} info.password
   */
  static async signIn(session, info) {
    const { portalId, password } = info

    if (!portalId || !password) {
      return
    }

    const hashedPw = this.hashPw(password)
    const sql = `
      SELECT *
      FROM user
      WHERE portal_id = ? AND password = ?
    `
    const values = [portalId, hashedPw]
    const [results] = await conn.execute(sql, values)

    if (results.length === 0) {
      // Login failed
      return {
        err: true
      }
    } else {
      return {
        err: false
      }
    }
  }

  /**
   * @param {Object} info
   * @param {string} info.portalId
   * @param {string} info.password
   * @param {string} info.nickname
   */
  static async signUp(info) {
    const { portalId, password, nickname } = info

    if (!portalId || !password || !nickname) {
      return
    }

    const sql = `
      select portal_id
      from
      (
        select portal_id
        from user
        union
        select portal_id
        from pending_user
      ) user_union
      where portal_id = ?
    `
    const values = [portalId]
    const [results] = await conn.execute(sql, values)

    if (results.length === 0) {
      // Available
      // There's no user with this portal ID yet
      // Generate hash and send a verification email

      const sql = `
        insert into pending_user
        (portal_id, password, registered_at, nickname, random_nickname, token)
        values (?, ?, ?, ?, "random nickname", ?)
      `
      const verificationCode = crypto.randomBytes(20).toString('hex')
      const values = [
        portalId,
        this.hashPw(password),
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
        nickname,
        verificationCode
      ]
      const [results] = await conn.execute(sql, values)

      Mailer.sendMail({
        to: portalId,
        subject: '어디로 인증 이메일입니다',
        html: `
          <a href="https://eodiro.com/verification?hash=${verificationCode}">인증하기</a>
        `
      })

      return results
    } else {
      // There already exists a user with this portal ID
      return {
        err: true
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
