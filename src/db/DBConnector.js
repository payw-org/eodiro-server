const mysql = require('mysql')

class DBConnector {
  static connect() {
    if (!DBConnector._connection) {
      this._connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      })

      this._connection.connect(err => {
        if (err) {
          console.error(err.stack)
          throw new Error('MySQL connection failed')
        } else {
          console.log('Connected to MySQL at id: ' + this._connection.threadId)
        }
      })
    }
  }

  static getConnection() {
    if (!this._connection) {
      this.connect()
    }

    return this._connection
  }
}

module.exports = DBConnector
