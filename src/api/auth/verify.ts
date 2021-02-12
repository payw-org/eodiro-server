import { httpStatus } from '@/constant/http-status'
import { extractJwt } from '@/modules/auth/extract-token'
import { JwtError, verifyJwt } from '@/modules/jwt'
import express from 'express'

const router = express.Router()

export type ApiAuthGeneralErrResData = {
  error: JwtError | null
}

export type ApiAuthVerifyResData = ApiAuthGeneralErrResData

// Verify pending user
router.post('/auth/verify', async (req, res) => {
  const accessToken = extractJwt(req, res, 'access')

  const [error] = await verifyJwt(accessToken, 'access')

  // If error, set the status code to 401
  if (error) {
    console.error(error)
    res.sendStatus(httpStatus.UNAUTHORIZED)
    return
  }

  res.sendStatus(httpStatus.OK)
})

export default router
