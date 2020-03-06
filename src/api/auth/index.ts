import Db from '@/db'
import Admin from '@/db/admin'
import RefreshTokenTable from '@/db/refresh-token-table'
import User from '@/db/user'
import Auth, { SignUpInfo } from '@/modules/auth'
import Jwt from '@/modules/jwt'
import express from 'express'

const router = express.Router()

// Finds and returns user information
router.get('/information', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)
  if (payload) {
    const user = await User.findAtId(payload.userId)
    res.status(200).json(user)
  } else {
    res.sendStatus(401)
  }
})

// Is signed in
router.post('/is-signed-in', async (req, res) => {
  // headers key names are case insensitive
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)

  res.status(200).json({ isSignedIn: payload ? true : false })
})

// Sign up
router.post('/sign-up', async (req, res) => {
  const signUpInfo: SignUpInfo = req.body
  const portalId = Db.escape(signUpInfo?.portalId)
  const nickname = Db.escape(signUpInfo?.nickname)
  const password = Db.escape(signUpInfo?.password)
  const validations = {
    portalId:
      (await Auth.isValidPortalId(portalId)) &&
      Auth.isValidPortalIdFormat(portalId),
    nickname: await Auth.isValidNickname(nickname),
    password: Auth.isValidPassword(password),
  }

  if (validations.portalId && validations.password && validations.nickname) {
    const signUpResult = await Auth.signUp(signUpInfo)

    if (!signUpResult) {
      res.sendStatus(500)
      return
    }
  }

  res.json(validations)
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
    const payload = {
      userId: userId,
      isAdmin: await Admin.isAdmin(userId),
    }
    const tokens = await Jwt.getTokenOrCreate(payload)
    res.json(tokens)
  } else {
    res.json(false)
  }
})

// Validate portal email id
router.post('/validate/portal-id', async (req, res) => {
  const portalId = req.body.portalId
  if (
    (await Auth.isValidPortalId(portalId)) &&
    Auth.isValidPortalIdFormat(portalId)
  ) {
    res.json(true)
  } else {
    res.json(false)
  }
})

// Validate nickname
router.post('/validate/nickname', async (req, res) => {
  const nickname = req.body.nickname
  if (
    (await Auth.isValidNickname(nickname)) &&
    Auth.isValidNicknameFormat(nickname)
  ) {
    res.json(true)
  } else {
    res.json(false)
  }
})

// Validate password
router.post('/validate/password', async (req, res) => {
  const password = req.body.password
  if (Auth.isValidPassword(password)) {
    res.json(true)
  } else {
    res.json(false)
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
    const tokens = await Jwt.refresh(req.headers.refreshtoken as string)
    res.send(tokens)
  } catch (err) {
    res.sendStatus(401)
  }
})

// Delete refresh token
router.delete('/refresh-token', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)

  if (payload) {
    const result = await RefreshTokenTable.deleteRefreshToken(payload.userId)
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
