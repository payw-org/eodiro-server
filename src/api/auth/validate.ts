import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

// Validate portal email id
router.post('/validate/portal-id', async (req, res) => {
  let portalId: string = req.body.portalId
  const existence: boolean = req.body.existence

  portalId = portalId.trim()

  if (!portalId.includes('@')) {
    portalId += '@cau.ac.kr'
  }

  if (existence) {
    res.json(
      !(await Auth.isValidPortalId(portalId)) &&
        Auth.isValidPortalIdFormat(portalId)
    )
  } else {
    res.json(
      (await Auth.isValidPortalId(portalId)) &&
        Auth.isValidPortalIdFormat(portalId)
    )
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
