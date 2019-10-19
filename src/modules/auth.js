const conn = require('@/db/db-connector').getConnection()
const crypto = require('crypto')
const dayjs = require('dayjs')

class Auth {
  static hashPw(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('base64')
  }

  static async signIn(session, options) {
    const { portalId, password } = options

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

    const pwHash = this.hashPw(password)

    const query = 'SELECT * FROM users WHERE portal_id = ? AND password = ?'
    const values = [portalId, pwHash]
    const { err, results } = await new Promise(resolve => {
      conn.query(query, values, (err, results) => {
        resolve({ err, results })
      })
    })

    if (!err && results.length === 1) {
      session.auth = results[0]

      return {
        err: false
      }
    } else {
      return {
        err: 6
      }
    }
  }

  static async signUp(options) {
    const { portalId, password, nickname } = options

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

    const query = 'SELECT * FROM users WHERE portal_id = ?'
    const values = [portalId]
    const { results } = await new Promise(resolve => {
      conn.query(query, values, (err, results) => {
        resolve({ err, results })
      })
    })

    if (results.length === 0) {
      // Available
      const query2 =
        'INSERT INTO users_pending (portal_id, password, registered_at, nickname, random_nickname, token) VALUES (?, ?, ?, ?, "random nickname", ?)'
      const values2 = [
        portalId,
        this.hashPw(password),
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
        nickname,
        crypto.randomBytes(20).toString('hex')
      ]
      const { err } = await new Promise(resolve => {
        conn.query(query2, values2, (err, results) => {
          resolve({ err, results })
        })
      })

      if (!err) {
        return {
          err: false
        }
      }
    } else if (results.length === 1) {
      // There already exists a user with this portal ID
      return {
        err: 5
      }
    } else {
      // Fatal error
      // Must be reviewed by the maintainers
      return {
        err: 7
      }
    }
  }

  static signOut(session) {
    session = null
  }
}

module.exports = Auth
