require('module-alias/register')
import api from '@/api'
import dbValidator from '@/db/helpers/db-validator'
import DbConnector from '@/modules/db-connector'
import EodiroBot from '@/modules/eodiro-bot'
import EodiroMailer from '@/modules/eodiro-mailer'
import Config from '@@/config'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'

dotenv.config()

export async function boot(options: {
  db?: boolean
  mail?: boolean
  bot?: boolean
  isDev: boolean
}): Promise<http.Server> {
  const { db = true, mail = true, bot = true, isDev } = options

  if (isDev) {
    console.log('🔥 Development Mode')
    process.env.NODE_ENV = 'development'
  } else {
    console.log('🌈 Production Mode')
  }

  // Create Express app
  const app = express()

  // Use middlewares
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(api)

  if (db) {
    // Connect to database
    const isDbConnected = await DbConnector.connect()

    if (!isDbConnected) {
      console.info('🛑 Stop the application due to DB connection failure')
      return
    } else {
      await dbValidator()
    }
  } else {
    console.info('⏩ Skipping DB connection')
  }

  if (mail) {
    // Connect to Zoho mail server
    const isMailServerConnected = await EodiroMailer.verify()

    if (!isMailServerConnected) {
      console.info(
        '🛑 Stop the application due to Email server connection failure'
      )
      return
    }
  } else {
    console.info('⏩ Skipping Email server connection')
  }

  if (bot) {
    // Run eodiro bot
    const eodiroBot = new EodiroBot()
    eodiroBot.run()
  } else {
    console.info('🤖🏖 eodiro Bot is not running')
  }

  // Open the gate
  const port = isDev ? Config.DEV_PORT : Config.PORT
  const server = app.listen(port, () => {
    console.info(`👂 Listening on port ${port}`)
  })

  return server
}
