import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

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

export default router
