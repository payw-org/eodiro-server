import mysql from 'mysql'
import Config from '@@/config'

export default class DbConnector {
  private static connection: mysql.Connection | undefined

  static connect(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.connection) {
        return
      }

      const database =
        process.env.NODE_ENV === 'development'
          ? Config.DB_NAME_DEV
          : Config.DB_NAME

      this.connection = mysql.createConnection({
        host: Config.DB_HOST,
        user: Config.DB_USER,
        password: Config.DB_PASSWORD,
        database,
        charset: 'utf8mb4',
        multipleStatements: true
      })

      this.connection.connect(err => {
        if (err) {
          this.connection = undefined
          console.error(err.message)
          console.error('❌ Failed to connect to Database')
          resolve(false)
        } else {
          console.info(`⭕️ Connected to DB (${database})`)
          resolve(true)
        }
      })
    })
  }

  static async getConnection(): Promise<mysql.Connection> {
    if (!this.connection) {
      await this.connect()
    }

    return this.connection
  }
}
