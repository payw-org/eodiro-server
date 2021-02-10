import Auth, { JoinInfo, JoinResult } from '@/modules/auth'
import express from 'express'

export type ApiAuthJoinRequestBody = JoinInfo
export type ApiAuthJoinResponseData = JoinResult

const router = express.Router()

// Sign up
router.post('/auth/join', async (req, res) => {
  const signUpInfo = req.body as ApiAuthJoinRequestBody
  const signUpResult = await Auth.signUp(signUpInfo)

  res.json(signUpResult)
})

export default router
