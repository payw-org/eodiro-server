import 'module-alias/register'
import dotenv from 'dotenv'
import crypto from 'crypto'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import api from '@/api'
import EodiroBot from '@/modules/eodiro-bot'
import DbConnector from '@/modules/db-connector'
import EodiroMailer from '@/modules/eodiro-mailer'
import Config from '@@/config'
import cors from 'cors'
import dbValidator from '@/db/helpers/db-validator'

async function main(): Promise<void> {
  // Create Express app
  const app = express()

  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(
    session({
      secret: crypto.randomBytes(64).toString(),
      resave: false,
      saveUninitialized: true,
    })
  )
  app.use(api)

  // Connect to database
  const isDbConnected = await DbConnector.connect()

  if (!isDbConnected) {
    console.info('🛑 Stop the application due to DB connection failed')
    return
  } else {
    await dbValidator()
  }

  // Connect to Zoho mail server
  const isMailServerConnected = await EodiroMailer.verify()

  if (!isMailServerConnected) {
    console.info(
      '🛑 Stop the application due to Email server connection failed'
    )
    return
  }

  const port =
    process.env.NODE_ENV === 'development' ? Config.DEV_PORT : Config.PORT

  app.listen(port, () => {
    console.info(`👂 Listening on port ${port}`)
  })

  // Run eodiro bot
  const eodiroBot = new EodiroBot()
  eodiroBot.run()
}

// Run the app
dotenv.config()
main()
