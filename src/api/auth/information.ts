import User from '@/db/user'
import Auth from '@/modules/auth'
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

export default router
