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
router.post<any, ApiAuthGeneralErrResData>('/auth/verify', async (req, res) => {
  const accessToken = extractJwt(req, res, 'access')

  const [error] = await verifyJwt(accessToken, 'access')

  // If error, set the status code to 401
  if (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error })
  }

  res.status(httpStatus.OK).json({ error })
})

export default router
