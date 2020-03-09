import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

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

export default router
