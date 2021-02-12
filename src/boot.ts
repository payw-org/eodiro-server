import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import api from './api'
import Config from './config'
import { prisma } from './modules/prisma'
import { isDev } from './modules/utils/is-dev'

const dev = isDev()
const log = console.log

type QuitFunction = () => void

export async function boot(): Promise<QuitFunction> {
  // Create Express app
  const app = express()

  // Use middleware
  app.use(
    cors({
      credentials: true,
      origin: dev ? ['http://localhost:3020'] : ['https://eodiro.com'],
    })
  )
  app.use(morgan('tiny'))
  app.use(cookieParser())
  app.use(express.json({ limit: '100mb' }))
  app.use(express.urlencoded({ limit: '100mb', extended: true }))
  app.use(api)

  let server: http.Server = undefined

  const port =
    process.env.NODE_ENV === 'development' ? Config.DEV_PORT : Config.PORT
  const expressServer = app.listen(port, () => {
    log(`[${chalk.magentaBright('eodiro')}] Listening on port ${port}`)
  })

  server = expressServer

  // const io = socketIO(server)

  // io.on('connection', async (socket) => {
  //   const accessToken = socket.handshake.query.accessToken as string
  //   const authPaylod = await Auth.isSignedUser(accessToken)

  //   if (!authPaylod) {
  //     socket.error('Unauthorized')
  //     socket.disconnect()
  //     return
  //   } else {
  //     const user = await User.findAtId(authPaylod.userId)

  //     io.emit(
  //       'user_num_changed',
  //       Object.keys(io.nsps['/'].adapter.rooms).length
  //     )

  //     socket.on('disconnect', () => {
  //       io.emit(
  //         'user_num_changed',
  //         Object.keys(io.nsps['/'].adapter.rooms).length
  //       )
  //     })

  //     socket.on('send_live_chat', (data) => {
  //       // mine
  //       socket.emit('new_live_chat_mine', data)
  //       // others
  //       socket.broadcast.emit('new_live_chat', {
  //         ...data,
  //         rn: user.random_nickname,
  //       })
  //     })
  //   }
  // })

  function quit() {
    // Disconnect from database
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
