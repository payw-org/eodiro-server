import { CauNoticeWatcher } from './index'
import { cau, cse } from './publishers'

const watcher = new CauNoticeWatcher()

watcher.register(cau)
watcher.register(cse)

watcher.run().then()
