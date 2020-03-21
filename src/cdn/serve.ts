import config from '@/config'
import { isDev } from '@/modules/utils/is-dev'
import appRoot from 'app-root-path'
import chalk from 'chalk'
import http from 'http'
import os from 'os'
import path from 'path'
import handler from 'serve-handler'

const homeDir = os.homedir()

const publicDir = isDev()
  ? appRoot.resolve('/storage')
  : path.resolve(homeDir, config.PUBLIC_DIR)

const server = http.createServer((request, response) => {
  return handler(request, response, {
    directoryListing: false,
    public: publicDir,
  })
})

const port = isDev() ? config.CDN_DEV_PORT : config.CDN_PORT

server.listen(port, () => {
  console.log(
    `[ ${chalk.blue('CDN')} ] serving '${chalk.green(
      publicDir
    )}' at port ${chalk.yellow(port)}`
  )
})
