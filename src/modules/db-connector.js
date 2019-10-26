const mysql = require('mysql2')

class DBConnector {
  static connect() {
    if (!DBConnector._connection) {
      const database =
        process.env.NODE_ENV === 'development'
          ? process.env.DB_NAME_DEV
          : process.env.DB_NAME

      this._connection = mysql
        .createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          multipleStatements: true
        })
        .promise()
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
