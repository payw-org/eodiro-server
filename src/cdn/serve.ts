import config from '@/config'
import { isDev } from '@/modules/utils/is-dev'
import chalk from 'chalk'
import http from 'http'
import handler from 'serve-handler'
import { getStoragePath } from './get-storage-path'

const publicDir = getStoragePath()

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
