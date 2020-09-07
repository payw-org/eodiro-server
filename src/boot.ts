import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import api from './api'
import Config from './config'
import { User } from './database/models/user'
import Auth from './modules/auth'
import DbConnector from './modules/db-connector'
import EodiroMailer from './modules/eodiro-mailer'
import prisma from './modules/prisma'

const log = console.log

type QuitFunction = () => void

export async function boot(options: {
  db?: boolean
  mail?: boolean
  /**
   * Whether to open the port
   */
  listen?: boolean
}): Promise<QuitFunction> {
  const { db = false, mail = false, listen = false } = options

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

      process.exit()
    }
  } else {
    log(`[ ${chalk.green('DB')} ] skip db connection`)
  }

  if (mail && process.env.npm_config_nomail !== 'true') {
    // Connect to Zoho mail server
    const isMailServerConnected = await EodiroMailer.verify()

    if (!isMailServerConnected) {
      log(
        `[ ${chalk.red(
          'error'
        )} ] stop the application due to email server connection failure`
      )

      process.exit()
    }
  }

  let server: http.Server = undefined

  // Open the gate
  if (listen) {
    // Create an apollo server
    // const prisma = new PrismaClient()
    // const apolloServer = new ApolloServer({
    //   schema,
    //   context: () => ({ prisma }),
    // })
    // apolloServer.applyMiddleware({ app })

    const port =
      process.env.NODE_ENV === 'development' ? Config.DEV_PORT : Config.PORT
    const expressServer = app.listen(port, () => {
      log(`[ ${chalk.magenta('server')} ] listening on port ${port}`)
    })

    server = expressServer

    const io = socketIO(server)

    io.on('connection', async (socket) => {
      const accessToken = socket.handshake.query.accessToken as string
      const authPaylod = await Auth.isSignedUser(accessToken)

      if (!authPaylod) {
        socket.error('Unauthorized')
        socket.disconnect()
        return
      } else {
        const user = await User.findAtId(authPaylod.userId)

        io.emit(
          'user_num_changed',
          Object.keys(io.nsps['/'].adapter.rooms).length
        )

        socket.on('disconnect', () => {
          io.emit(
            'user_num_changed',
            Object.keys(io.nsps['/'].adapter.rooms).length
          )
        })

        socket.on('send_live_chat', (data) => {
          // mine
          socket.emit('new_live_chat_mine', data)
          // others
          socket.broadcast.emit('new_live_chat', {
            ...data,
            rn: user.random_nickname,
          })
        })
      }
    })
  }

  function quit() {
    // Disconnect from database
    DbConnector.getConnConfident().destroy()
    prisma.$disconnect()

    if (server) {
      // close the server
      server.close()
    }

    // kill the process to make sure to retrieve memory
    process.exit()
  }

  return quit
}
