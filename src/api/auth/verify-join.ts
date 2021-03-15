import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { prisma } from '@/modules/prisma'
import express from 'express'
import { body } from 'express-validator'

export type ApiAuthVerifyJoinReqBody = {
  token: string
}

const router = express.Router()

router.post<any, any, ApiAuthVerifyJoinReqBody>(
  '/verify-join',
  body('token').isString(),
  handleExpressValidation,
  async (req, res) => {
    const { token } = req.body

    const pendingUser = await prisma.pendingUser.findUnique({
      where: { token },
    })

    if (!pendingUser) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const clearPendingUser = prisma.pendingUser.delete({
      where: { token },
    })
    const {
      portalId,
      nickname,
      password,
      randomNickname,
      joinedAt,
    } = pendingUser
    const createUser = prisma.user.create({
      data: { portalId, nickname, password, randomNickname, joinedAt },
    })

    await prisma.$transaction([clearPendingUser, createUser])

    res.sendStatus(httpStatus.OK)
  }
)

export default router
