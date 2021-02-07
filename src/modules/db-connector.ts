import Config from '@/config'
import chalk from 'chalk'
import mysql from 'mysql'

const log = console.log

/**
 * @deprecated
 */
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
          log(`[ ${chalk.red('error')} ] failed to connect to db server`)
          resolve(false)
        } else {
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
                log(
                  `[ ${chalk.red(
                    'error'
                  )} ] failed to connect to db '${database}'`
                )
                resolve(false)
              } else {
                log(`[ ${chalk.green('DB')} ] connected to db <${database}>`)

                // handle connection error
                this.connection.on('error', () => {
                  log(
                    `[ ${chalk.green(
                      'DB ↺'
                    )} ] reconnect to db due to connection error`
                  )

                  this.connection = undefined
                  this.connect()
                })

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

  /**
   * Get connection synchronously if you're sure
   * that the connection is successfully established
   */
  static getConnConfident(): mysql.Connection {
    return this.connection || mysql.createConnection({})
  }
}
