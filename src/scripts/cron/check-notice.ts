import { CauNoticeWatcher } from '@/modules/cau-notice-watcher'
import * as Publishers from '@/modules/cau-notice-watcher/publishers'
import { prisma } from '@/modules/prisma'

async function run() {
  const watcher = new CauNoticeWatcher()

  watcher.register(Publishers.cau)
  watcher.register(Publishers.dormitoryBlueMir)
  watcher.register(Publishers.cse)
  watcher.register(Publishers.log)

  try {
    await watcher.run()
  } catch (error) {
    console.error(error)
  }

  await prisma.$disconnect()
  process.exit()
}

run()
