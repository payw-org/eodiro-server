import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

// Is signed in
router.post('/is-signed-in', async (req, res) => {
  // headers key names are case insensitive
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)

  if (payload) {
    res.json({
      isSigned: true,
      userId: payload.userId,
      isAdmin: payload.isAdmin,
    })
  } else {
    res.json({
      isSigned: false,
    })
  }
})

export default router
