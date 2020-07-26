import * as Subscribers from '@/modules/cau-notice-watcher/subscribers'

import { CauNoticeWatcher } from '@/modules/cau-notice-watcher'
import { boot } from '@/boot'

async function run() {
  const quit = await boot({
    db: true,
    mail: true,
  })

  const feed = new CauNoticeWatcher()

  feed.subscribe(Subscribers.cau)
  feed.subscribe(Subscribers.dormitoryBlueMir)
  feed.subscribe(Subscribers.cse)
  feed.subscribe(Subscribers.log)

  await feed.run()

  quit()
  process.exit()
}

run()
