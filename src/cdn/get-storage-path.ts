import appRoot from 'app-root-path'
import config from '@/config'
import dayjs from 'dayjs'
import fs from 'fs'
import { homedir } from 'os'
import { isDev } from '@/modules/utils/is-dev'

export function getStoragePath(): string {
  const path = isDev()
    ? appRoot.resolve('/storage')
    : homedir() + config.PUBLIC_DIR

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }

  return path
}

export function getPublicUserContentPath({
  date,
  forClient = false,
}: {
  date?: Date
  forClient?: boolean
}): string {
  const storagePath = getStoragePath()

  const publicUserContentPath =
    (!forClient ? storagePath : '') +
    '/public-user-content' +
    (date ? `/${dayjs(date).format('YYYYMMDD')}` : '')

  if (fs.existsSync(publicUserContentPath)) {
    fs.mkdirSync(publicUserContentPath, { recursive: true })
  }

  return publicUserContentPath
}
