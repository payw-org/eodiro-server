import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import Auth from '@/modules/auth'
import {
  AuthValidationResult,
  validatePassword,
} from '@/modules/auth/validation'
import { makeBodyValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiAuthChangePasswordReqBody = {
  token: string
  newPassword: string
}

export type ApiAuthChangePasswordResData = {
  result: AuthValidationResult
}

const changePasswordBody = makeBodyValidator<ApiAuthChangePasswordReqBody>()

router.post<any, any, ApiAuthChangePasswordReqBody>(
  '/change-password',
  changePasswordBody('token').isString(),
  changePasswordBody('newPassword').isString(),
  handleExpressValidation,
  async (req, res) => {
    const { token, newPassword } = req.body

    const changePasswordInfo = await prisma.changePassword.findUnique({
      where: {
        token,
      },
    })

    if (!changePasswordInfo) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const validation = await validatePassword(newPassword)

    if (!validation.isValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: validation.error?.message,
      })
    }

    const userId = changePasswordInfo.userId

    const deleteChangePasswordInfo = prisma.changePassword.delete({
      where: { userId },
    })
    const updatePassword = prisma.user.update({
      where: { id: userId },
      data: {
        password: await Auth.encryptPw(newPassword),
      },
    })

    await prisma.$transaction([deleteChangePasswordInfo, updatePassword])

    res.sendStatus(200)
  }
)

export default router
