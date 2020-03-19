import { user } from '@/database/models/user'
import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

// Finds and returns user information
router.get('/information', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)

  if (payload) {
    const User = await user()
    const userInfo = await User.findAtId(payload.userId)
    res.status(200).json(userInfo)
  } else {
    res.sendStatus(401)
  }
})

export default router
