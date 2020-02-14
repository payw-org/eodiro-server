import express from 'express'
import Auth from '@/modules/auth'
import User from '@/db/user'
import Db from '@/db'
import { PostModel } from '@/db/models'
import SqlB from '@/modules/sqlb'

const router = express.Router()

// Finds and returns user information
router.get('/my/information', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const userId = await Auth.isSignedUser(accessToken)
  if (userId) {
    const user = await User.findAtId(userId)
    res.status(200).json(user)
  } else {
    res.sendStatus(401)
  }
})

router.get('/my/posts', async (req, res) => {
  const accessToken = req.headers.accesstoken as string
  const userId = await Auth.isSignedUser(accessToken)
  const amount = req.query.amount || 10
  const offset = req.query.offset || 0

  if (!userId) {
    res.sendStatus(401)
    return
  }

  const query = SqlB()
    .select('*')
    .from('post')
    .where()
    .same('user_id', userId)
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
