import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { requireAuth } from '@/middleware/require-auth'
import { availableVendors } from '@/modules/cau-notice-watcher/publishers'
import { makeBodyValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { dbNow } from '@/modules/time'
import express from 'express'

const router = express.Router()

router.use(requireAuth)

// Get all subscriptions

export type ApiNoticeNotificationsGetResData = string[] // key[]

router.get('/notice-notifications', async (req, res) => {
  const { user } = req

  const subscriptions = await prisma.noticeNotificationsSubscription.findMany({
    where: {
      userId: user.id,
    },
  })
  const keys = subscriptions.map((sub) => sub.noticeKey)

  res.json(keys)
})

// Subscribe

export type ApiNoticeNotificationsSubscribeReqBody = {
  key: string
}

export type ApiNoticeNotificationsSubscribeResData = {
  subscribed: boolean
}

const subscribeBody = makeBodyValidator<ApiNoticeNotificationsSubscribeReqBody>()

router.post<
  any,
  ApiNoticeNotificationsSubscribeResData,
  ApiNoticeNotificationsSubscribeReqBody
>(
  '/notice-notifications',
  subscribeBody('key').isString(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { key } = req.body

    const keyIndex = availableVendors.findIndex((vendor) => vendor.key === key)

    if (keyIndex === -1) {
      res.status(404).end()
      return
    }

    // Find the existing subscription
    const existingSubscription = await prisma.noticeNotificationsSubscription.findFirst(
      {
        where: {
          userId: user.id,
          noticeKey: key,
        },
      }
    )

    if (existingSubscription) {
      await prisma.noticeNotificationsSubscription.delete({
        where: { id: existingSubscription.id },
      })

      res.json({ subscribed: false })
    } else {
      await prisma.noticeNotificationsSubscription.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          noticeKey: key,
          subscribedAt: dbNow(),
        },
      })

      res.json({ subscribed: true })
    }
  }
)

export default router
