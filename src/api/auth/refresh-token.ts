import RefreshTokenTable from '@/db/refresh-token-table'
import Auth from '@/modules/auth'
import Jwt from '@/modules/jwt'
import express from 'express'

const router = express.Router()

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
