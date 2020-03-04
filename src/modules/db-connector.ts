import Config from '@@/config'
import mysql from 'mysql'

export default class DbConnector {
  private static connection: mysql.Connection | undefined

  static connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.connection) {
        return
      }

      const database =
        process.env.NODE_ENV === 'development'
          ? Config.DB_NAME_DEV
          : Config.DB_NAME

      const createDbSql = `create database if not exists ${database} default character set = 'utf8mb4' default collate = 'utf8mb4_unicode_ci';`

      const tempConnection = mysql.createConnection({
        host: Config.DB_HOST,
        user: Config.DB_USER,
        password: Config.DB_PASSWORD,
        charset: 'utf8mb4',
        multipleStatements: true,
      })

      tempConnection.connect((err) => {
        if (err) {
          console.error('❌ Failed to connect to DB server')
          resolve(false)
        } else {
          console.info(`☁️ Connected to DB server`)

          tempConnection.query(createDbSql, () => {
            tempConnection.destroy()

            this.connection = mysql.createConnection({
              host: Config.DB_HOST,
              user: Config.DB_USER,
              password: Config.DB_PASSWORD,
              charset: 'utf8mb4',
              database,
              multipleStatements: true,
            })

            this.connection.connect((err) => {
              if (err) {
                this.connection = undefined
                console.error(err.message)
                console.error('❌ Failed to connect to DB')
                resolve(false)
              } else {
                console.info(`📦 Connected to DB [${database}]`)
                resolve(true)
              }
            })
          })
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
