import express from 'express'
import Auth from '@/modules/auth'
import { SignUpInfo } from '@/modules/auth'
import JwtManager from '@/modules/jwtManager'
import User from '@/db/user'
import RefreshTokenFromDB from '@/db/RefreshTokenFromDB'

const router = express.Router()

// Finds and returns user information
router.get('/information', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const userId = await Auth.isSignedUser(accessToken)
  if (userId) {
    const user = await User.findAtId(userId)
    res.status(200).json(user)
  } else {
    res.sendStatus(401)
  }
})

// Is signed in
router.post('/is-signed-in', async (req, res) => {
  // headers key names are case insensitive
  const accessToken = req.headers.accesstoken as string
  const isSignedUser = await Auth.isSignedUser(accessToken)
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
router.post('/verify', async (req, res) => {
  const requestData = req.body
  const isVerified = await Auth.verifyPendingUser(requestData.token)

  if (isVerified) {
    res.sendStatus(201)
  } else {
    res.sendStatus(404)
  }
})

// Sign in
router.post('/sign-in', async (req, res) => {
  const [userId, isSucceeded] = await Auth.signIn(req.body)
  if (isSucceeded) {
    const tokens = await JwtManager.getToken(userId)
    res.send(tokens)
  } else {
    res.sendStatus(401)
  }
})

// Validate portal email id
router.post('/validate/portal-id', async (req, res) => {
  const portalId = req.body.portalId
  if (
    (await Auth.isValidPortalId(portalId)) &&
    Auth.isValidPortalIdFormat(portalId)
  ) {
    res.sendStatus(200)
    return
  } else {
    res.sendStatus(403)
  }
})

// Validate nickname
router.post('/validate/nickname', async (req, res) => {
  const nickname = req.body.nickname
  if (
    (await Auth.isValidNickname(nickname)) &&
    Auth.isValidNicknameFormat(nickname)
  ) {
    res.sendStatus(200)
    return
  } else {
    res.sendStatus(403)
  }
})

// Validate password
router.post('/validate/password', async (req, res) => {
  const password = req.body.password
  if (Auth.isValidPassword(password)) {
    res.sendStatus(200)
    return
  } else {
    res.sendStatus(403)
  }
})

// Sign out
router.post('/sign-out', async (req, res) => {
  if (await Auth.signOut(req.session)) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

// Refresh access and refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const tokens = await JwtManager.refresh(req.headers.refreshtoken as string)
    res.send(tokens)
  } catch (err) {
    res.sendStatus(401)
  }
})

// Delete refresh token
router.delete('/refresh-token', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const userId = await Auth.isSignedUser(accessToken)

  if (userId) {
    const result = await RefreshTokenFromDB.deleteRefreshToken(userId)
    if (result) {
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(401)
  }
})

export default router
