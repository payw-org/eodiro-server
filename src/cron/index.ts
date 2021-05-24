import { CronJob } from 'cron'
import { backupDb } from './backup-db'
import { checkBoardCandidateVotes } from './check-board-candidate-votes'
import { checkNotice } from './check-notice'
import { clearPendingUsers } from './clear-pending-users'
import { updateRandomNicknames } from './update-random-nicknames'

// Every 15 minutes
new CronJob('*/15 * * * *', checkNotice, null, true, 'Asia/Seoul')

// Every 30 minutes
new CronJob('*/30 * * * *', clearPendingUsers, null, true, 'Asia/Seoul')

// every 00:00
new CronJob('0 0 * * *', backupDb, null, true, 'Asia/Seoul')
new CronJob('0 0 * * *', checkBoardCandidateVotes, null, true, 'Asia/Seoul')
new CronJob('0 0 * * *', updateRandomNicknames, null, true, 'Asia/Seoul')

// Kill processes every 15 minutes in production
// if (isDev) {
//   new CronJob('*/15 * * * *', () => {
//     const queries = ['prisma', 'chromium']
//     queries.forEach((query) => kill(query))
//   }, null, true, 'Asia/Seoul')
// }
