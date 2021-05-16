import { isDev } from '@/modules/utils/is-dev'
import kill from '@/modules/utils/kill'
import schedule from 'node-schedule'
import { backupDb } from './backup-db'
import { checkBoardCandidateVotes } from './check-board-candidate-votes'
import { checkNotice } from './check-notice'
import { clearPendingUsers } from './clear-pending-users'
import { updateRandomNicknames } from './update-random-nicknames'

// Every 15 minutes
schedule.scheduleJob('*/15 * * * *', checkNotice)

// Every 30 minutes
schedule.scheduleJob('*/30 * * * *', clearPendingUsers)

// every 00:00
schedule.scheduleJob('0 0 * * *', backupDb)
schedule.scheduleJob('0 0 * * *', checkBoardCandidateVotes)
schedule.scheduleJob('0 0 * * *', updateRandomNicknames)

// Kill processes every 15 minutes in production
if (isDev) {
  schedule.scheduleJob('*/15 * * * *', () => {
    const queries = ['prisma', 'chromium']
    queries.forEach((query) => kill(query))
  })
}
