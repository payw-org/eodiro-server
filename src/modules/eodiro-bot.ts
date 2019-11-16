// const conn = require('@/modules/db-connector').getConnection()
// const dayjs = require('dayjs')

import dayjs from 'dayjs'
import { CronJob } from 'cron'
import Db from '@/db'
import { UserModel } from '@/db/user'
import User from '@/db/user'

export default class EodiroBot {
  isRunning = false

  run(): void {
    if (this.isRunning) {
      return
    } else {
      this.isRunning = true
    }

    this.clearPendingUsers()
    this.updateRandomNickname()
  }

  /**
   * It checks the table 'pending_user' every 30 minutes
   * and eliminates rows which are expired
   */
  private clearPendingUsers(): void {
    const patrolTime = 1000 * 60 * 30
    setInterval(async () => {
      const query = `
        select *
        from pending_user
      `
      const [err, results] = await Db.query(query)
      if (err) {
        console.error(err.message)
      }

      ;(results as Array<UserModel>).forEach(async (row) => {
        const registeredAt = dayjs(row.registered_at)
        const now = dayjs()
        const timeDiffMs = now.diff(registeredAt)
        const timeDiffMin = timeDiffMs / 1000 / 60

        // If over 30 minutes after sending a verfication email
        // remove from the pending_user table
        if (timeDiffMin > 30) {
          const sql = `
            delete from pending_user
            where id = ?
          `
          const values = [row.id]
          await Db.query(sql, values)
        }
      })
    }, patrolTime)
  }

  private updateRandomNickname(): void {
    const cronTime = '0 0 * * *'
    const timeZone = 'Asia/Seoul'
    new CronJob(cronTime, User.updateRandomNickname, null, true, timeZone)
  }
}
