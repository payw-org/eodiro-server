import config from '@/config'
import wait from '@/modules/wait'
import chalk from 'chalk'
import { Sequelize } from 'sequelize'

const database =
  process.env.NODE_ENV === 'development' ? config.DB_NAME_DEV : config.DB_NAME

export class Database {
  private static sequelize: Sequelize
  private static initializing: boolean

  static async initSequelize(logging = false): Promise<void> {
    if (this.sequelize || this.initializing) {
      return
    }

    this.initializing = true

    const sequelize = new Sequelize(
      database,
      config.DB_USER,
      config.DB_PASSWORD,
      {
        host: config.DB_HOST,
        dialect: 'mysql',
        logging,
        define: {
          freezeTableName: true,
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
          timestamps: false,
          underscored: true,
        },
      }
    )

    try {
      await sequelize.authenticate()
      console.log(
        `[ ${chalk.rgb(
          0,
          168,
          201
        )('sequelize')} ] connected to db <${database}>`
      )
      this.sequelize = sequelize

      this.initializing = false
    } catch (error) {
      console.error('Database connection error')
    }
  }

  static async getSequelize(): Promise<Sequelize> {
    if (this.initializing) {
      while (this.sequelize === undefined) {
        await wait(300)
      }
    }

    if (this.sequelize) {
      return this.sequelize
    } else {
      await this.initSequelize()
      return this.getSequelize()
    }
  }
}
