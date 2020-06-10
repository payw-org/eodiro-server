import { UserAttrs } from '@/database/models/user'
import { boot } from '@/boot'
import dayjs from 'dayjs'
import { eodiroQuery } from '@/database/eodiro-query'
import prisma from '@/modules/prisma'

const run = async () => {
  const quit = await boot({ db: true })

  const query = `
    select *
    from pending_user
  `
  const results = await eodiroQuery<UserAttrs>(query)

  results.forEach(async (row) => {
    const registeredAt = dayjs(row.registered_at)
    const now = dayjs()
    const timeDiffMs = now.diff(registeredAt)
    const timeDiffMin = timeDiffMs / 1000 / 60

    // If over 30 minutes after sending a verfication email
    // remove from the pending_user table
    if (timeDiffMin > 30) {
      await prisma.pendingUser.delete({
        where: {
          id: row.id,
        },
      })
    }
  })

  quit()
}

run()
