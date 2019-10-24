const conn = require('@/modules/db-connector').getConnection()
const dayjs = require('dayjs')

class Bot {
  /**
   * It checks the table 'pending_user' every 30 minutes
   * and eliminates rows which are expired
   */
  clearPendingUsers() {
    const time = 1000 * 60 * 30
    setInterval(async () => {
      const sql = `
        select *
        from pending_user
      `
      /**
       * @type {[[]]}
       */
      const [results] = await conn.execute(sql)

      results.forEach(async row => {
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
          await conn.execute(sql, values)
        }
      })
    }, time)
  }
}

module.exports = Bot
