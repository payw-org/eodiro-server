import { ApolloServer } from 'apollo-server-express'
import Config from './config'
import DbConnector from './modules/db-connector'
import EodiroBot from './modules/eodiro-bot'
import EodiroMailer from './modules/eodiro-mailer'
import { PrismaClient } from '@prisma/client'
import api from './api'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { schema } from '@/graphql'

const log = console.log

export async function boot(options: {
  db?: boolean
  mail?: boolean
  bot?: boolean
  listen?: boolean
}): Promise<http.Server | null> {
  const { db = false, mail = false, bot = false, listen = true } = options

  if (process.env.NODE_ENV === 'development') {
    log(`[ ${chalk.gray('mode')} ] ${chalk.blueBright('development')} mode`)
    process.env.NODE_ENV = 'development'
  } else {
    log(`[ ${chalk.gray('mode')} ] ${chalk.blueBright('production')} mode`)
  }

  // Create Express app
  const app = express()

  app.use(cors())

  // Use middlewares
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
  app.use(api)

  if (db) {
    // Connect to database
    const isDbConnected = await DbConnector.connect()

    if (!isDbConnected) {
      log(
        `[ ${chalk.red(
          'error'
        )} ] stop the application due to db connection failure`
      )
      return null
    }
  } else {
    log(`[ ${chalk.green('DB')} ] skip db connection`)
  }

  if (mail) {
    // Connect to Zoho mail server
    const isMailServerConnected = await EodiroMailer.verify()

    if (!isMailServerConnected) {
      log(
        `[ ${chalk.red(
          'error'
        )} ] stop the application due to email server connection failure`
      )
      return null
    }
  } else {
    log(`[ ${chalk.yellow('email')} ] skip connection`)
  }

  if (bot) {
    // Run eodiro bot
    const eodiroBot = new EodiroBot()
    eodiroBot.run()
  } else {
    log(`[ ${chalk.blue('eodiro bot')} ] not running`)
  }

  // Open the gate
  if (listen) {
    // Create an apollo server
    const prisma = new PrismaClient()
    const apolloServer = new ApolloServer({
      schema,
      context: () => ({ prisma }),
    })
    apolloServer.applyMiddleware({ app })

    const port =
      process.env.NODE_ENV === 'development' ? Config.DEV_PORT : Config.PORT
    const expressServer = app.listen(port, () => {
      log(`[ ${chalk.magenta('server')} ] listening on port ${port}`)
    })

    return expressServer
  } else {
    return null
  }
}
