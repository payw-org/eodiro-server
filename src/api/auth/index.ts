import express from 'express'
import Auth from '@/modules/auth'
import { SignUpInfo } from '@/modules/auth'
import JwtManager from '@/modules/jwtManager'

const router = express.Router()

// Is signed in
router.post('/is-signed-in', (req, res) => {
  // headers key names are case insensitive
  const accessToken = req.headers.accesstoken as string
  const isSignedUser = Auth.isSignedUser(accessToken)
  if (isSignedUser) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

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
  const [userId, isSucceeded] = await Auth.signIn(req.session, req.body)
  if (isSucceeded) {
    const tokens = await JwtManager.getToken(userId)
    res.send(tokens)
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
// Sign out
router.get('/refreshToken', async (req, res) => {
  try {
    const tokens = await JwtManager.refresh(req.headers.refreshtoken as string)
    res.send(tokens)
  } catch (err) {
    res.sendStatus(401)
  }
})
export default router
