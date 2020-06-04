import { Action, NoticeItem } from './interface'

import { CauNoticeWatcher } from '@/modules/cau-notice-watcher'
import { OneApiFunction } from '@/api/one/scheme/types/utils'

const func: OneApiFunction<Action> = async () => {
  const noticeWatcher = new CauNoticeWatcher()
  const lastNotice = noticeWatcher.loadLastNoticeFile()

  const catalog: NoticeItem[] = []

  for (const key in lastNotice) {
    catalog.push({
      key,
      displayName: lastNotice[key].displayName,
    })
  }

  return {
    err: null,
    data: {
      noticeCatalog: catalog,
    },
  }
}

export default func
