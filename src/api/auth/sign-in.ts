import { admin } from '@/database/models/admin'
import Auth from '@/modules/auth'
import Jwt from '@/modules/jwt'
import express from 'express'

const router = express.Router()

// Sign in
router.post('/sign-in', async (req, res) => {
  const Admin = await admin()
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

export default router
