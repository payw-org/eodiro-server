import { requireAuth } from '@/middleware/require-auth'
import prisma from '@/modules/prisma'
import { dbNow } from '@/modules/time'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.use(requireAuth)

router.post('/attendance', async (req, res) => {
  const { user } = req

  const attendedToday = await prisma.attendance.findUnique({
    where: {
      userId_attendedAt: {
        userId: user.id,
        attendedAt: dayjs().format('YYYY-MM-DD'),
      },
    },
  })

  if (attendedToday) {
    prisma.attendance.create({
      data: {
        userId: user.id,
        attendedAt: dbNow(),
      },
    })
  }
})

export default router
