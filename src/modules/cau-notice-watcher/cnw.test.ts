import { cau, cse } from './subscribers'

import { CauNoticeWatcher } from './index'

const watcher = new CauNoticeWatcher()

watcher.subscribe(cau)
watcher.subscribe(cse)

watcher.run().then()
