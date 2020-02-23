import express from 'express'
import peperoSquareRouter from '@/api/pepero-square'
import authRouter from '@/api/auth'
import uploadRouter from '@/api/upload'
import lecturesRouter from '@/api/lectures'
import myRouter from '@/api/my'
import vacantRouter from '@/api/vacant'

const router = express.Router()

router.get('/', (...ctx) => {
  const res = ctx[1]
  res.send(`<pre>
eodiro API 2
<a href="https://github.com/paywteam/eodiro-api2">Documentation</a>
</pre>`)
})

router.use('/pepero-square', peperoSquareRouter)
router.use('/auth', authRouter)
router.use(uploadRouter)
router.use(lecturesRouter)
router.use(myRouter)
router.use(vacantRouter)

export default router
