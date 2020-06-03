import * as Subscribers from '@/modules/cau-notice-watcher/subscribers'

import { CauNoticeWatcher } from '@/modules/cau-notice-watcher'
import EodiroMailer from '@/modules/eodiro-mailer'
import { boot } from '@/boot'

async function run() {
  const quit = await boot({
    db: true,
    mail: true,
  })

  const feed = new CauNoticeWatcher()

  feed.subscribe(Subscribers.cau)
  feed.subscribe(Subscribers.cse)

  await feed.run()

  await EodiroMailer.sendMail({
    to: 'contact@payw.org',
    subject: '[eodiro] Checked CAU notice',
    html: '',
  })

  quit()
}

run()
