import { httpStatus } from '@/constant/http-status'
import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

export type ApiAuthForgotReqBody = {
  portalId: string
}

router.post('/auth/forgot', async (req, res) => {
  const { portalId } = req.body as ApiAuthForgotReqBody
  const result = await Auth.changePassword(portalId)

  if (!result) {
    res.sendStatus(httpStatus.NOT_FOUND)
    return
  }

  res.sendStatus(httpStatus.OK)
})

export default router
