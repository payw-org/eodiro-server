import express from 'express'
import Auth from '@/modules/auth'
import { SignUpInfo } from '@/modules/auth'

const router = express.Router()

// Sign up
router.post('/sign-up', async (req, res) => {
  const signUpInfo: SignUpInfo = req.body
  const { portalId, nickname, password } = signUpInfo
  const validations = {
    portalId:
      (await Auth.isValidPortalId(portalId)) &&
      Auth.isValidPortalIdFormat(portalId),
    nickname: await Auth.isValidNickname(nickname),
    password: Auth.isValidPassword(password)
  }

  if (validations.portalId && validations.password && validations.nickname) {
    const signUpResult = await Auth.signUp(signUpInfo)

    if (signUpResult) {
      res.sendStatus(201)
    } else {
      res.sendStatus(500)
    }
  } else {
    res.status(409).json(validations)
  }
})

// Verify pending user
router.get('/verify', async (req, res) => {
  const requestData = req.body
  const isVerified = await Auth.verifyPendingUser(requestData.token)

  if (isVerified) {
    res.sendStatus(201)
  } else {
    res.sendStatus(404)
  }
})

// Sign in
router.get('/sign-in', async (req, res) => {
  const isSucceeded = await Auth.signIn(req.session, req.body)

  if (isSucceeded) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

// Sign out
router.get('/sign-out', async (req, res) => {
  if (await Auth.signOut(req.session)) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

export default router
