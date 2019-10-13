class Auth {
  static async signin(session, options) {
    const { portalId, password } = options

    const crypto = require('crypto')
    const pwHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('base64')

    const conn = require('@/db/db-connector').getConnection()
    const query = 'SELECT * FROM users WHERE portal_id = ? AND password = ?'
    const values = [portalId, pwHash]
    const queryResult = await new Promise(resolve => {
      conn.query(query, values, (err, results) => {
        if (err) {
          resolve({
            err: err.stack
          })
          return
        }

        resolve({
          err: false,
          rows: results
        })
      })
    })

    console.log(queryResult.rows)

    if (!queryResult.err && queryResult.rows.length === 1) {
      return true
    } else {
      return {
        err: true
      }
    }
  }
}

module.exports = Auth
