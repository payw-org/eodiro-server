import 'module-alias/register'
import crypto from 'crypto'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import api from '@/api'
import EodiroBot from '@/modules/eodiro-bot'
import DbConnector from '@/modules/db-connector'
import Config from '@@/config'
import EodiroMailer from '@/modules/eodiro-mailer'

async function main(): Promise<void> {
  // Run eodiro bot
  const eodiroBot = new EodiroBot()
  eodiroBot.run()

  // Create Express app
  const app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(
    session({
      secret: crypto.randomBytes(64).toString(),
      resave: false,
      saveUninitialized: true
    })
  )
  app.use(api)

  // Connect to database
  const isDbConnected = await DbConnector.connect()

  if (!isDbConnected) {
    console.info('🛑 Stop the application due to DB connection failed')
    return
  }

  // Connect to Zoho mail server
  const isMailServerConnected = await EodiroMailer.verify()

  if (!isMailServerConnected) {
    console.log('🛑 Stop the application due to Email server connection failed')
    return
  }

  app.listen(Config.PORT, () => {
    console.info(`👂 Listening on port ${Config.PORT}`)
  })
}

// Run the app
main()
