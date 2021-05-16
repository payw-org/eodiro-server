import env from '@/env'
import { isDev } from './utils/is-dev'

export const eodiroClientHost = isDev
  ? `http://localhost:${env.CLIENT_DEV_PORT}`
  : 'https://eodiro.com'

export const eodiroServerHost = isDev
  ? `http://localhost:${env.DEV_PORT}`
  : 'https://api2.eodiro.com'
