import { httpStatus } from '@/constants/http-status'
import prisma from '@/modules/prisma'
import { Campus } from '@/types'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.get('/cafeteria/:servedAt/:campus/menus', async (req, res) => {
  const now = dayjs()
  const campus: Campus = (req.params?.campus as Campus) || '서울'
  const servedAt = req.params?.servedAt || now.format('YYYY-MM-DD')

  const result = await prisma.cafeteriaMenu.findFirst({
    where: {
      campus,
      servedAt,
    },
    select: {
      data: true,
    },
  })

  if (!result) {
    res.sendStatus(httpStatus.NOT_FOUND)
    return
  }

  res.json(result.data)
})

export default router
