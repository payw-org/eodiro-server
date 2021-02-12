import authRouter from '@/api/auth'
import uploadImageRouter from '@/api/upload-image'
import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send(`
<pre>
  eodiro API 2
  <a href="https://github.com/paywteam/eodiro-api2">Documentation</a>
</pre>
`)
})

router.use(authRouter)
router.use(uploadImageRouter)
// router.use(lecturesRouter)
// router.use(myRouter)
// router.use(vacantRouter)
// router.use(cafeteriaRouter)

export default router
