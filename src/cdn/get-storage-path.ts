import config from '@/config'
import { isDev } from '@/modules/utils/is-dev'
import appRoot from 'app-root-path'
import { homedir } from 'os'

export function getStoragePath() {
  return isDev() ? appRoot.resolve('/storage') : homedir() + config.PUBLIC_DIR
}
