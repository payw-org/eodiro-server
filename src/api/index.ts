import authRouter from '@/api/auth'
import cafeteriaRouter from '@/api/cafeteria'
import inquiryRouter from '@/api/inquiry'
import lecturesRouter from '@/api/lectures'
import myRouter from '@/api/my'
import peperoSquareRouter from '@/api/pepero-square'
import uploadRouter from '@/api/upload'
import vacantRouter from '@/api/vacant'
import express from 'express'
import { oneAPI } from './eodiro-one-api'

const router = express.Router()

router.get('/', (...ctx) => {
  const res = ctx[1]
  res.send(`<pre>
eodiro API 2
<a href="https://github.com/paywteam/eodiro-api2">Documentation</a>
</pre>`)
})

// Experimental
// Single end point for all APIs
router.post('/one', async (req, res) => {
  const { action, data } = req.body

  const payload = await oneAPI({
    action,
    data,
  })

  return res.json(payload)
})

router.use('/pepero-square', peperoSquareRouter)
router.use('/auth', authRouter)
router.use(uploadRouter)
router.use(lecturesRouter)
router.use(myRouter)
router.use(vacantRouter)
router.use(cafeteriaRouter)
router.use(inquiryRouter)

export default router
