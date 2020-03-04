import Db from '@/db'
import { PostModel } from '@/db/models'
import User from '@/db/user'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import express from 'express'

const router = express.Router()

// Finds and returns user information
router.get('/my/information', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)
  if (payload) {
    const user = await User.findAtId(payload.userId)
    res.status(200).json(user)
  } else {
    res.sendStatus(401)
  }
})

router.get('/my/posts', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)
  const amount = req.query.amount || 10
  const offset = req.query.offset || 0

  if (!payload) {
    res.sendStatus(401)
    return
  }

  const query = SqlB()
    .select('*')
    .from('post')
    .where()
    .same('user_id', payload.userId)
    .order('id', 'desc')
    .limit(amount, offset)
    .build()
  const [err, results] = await Db.query<PostModel>(query)
  if (err) {
    res.sendStatus(500)
    return
  }

  res.json(results)
})

export default router
