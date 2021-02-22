import express from 'express'
import authRouter from './auth'
import communityRouter from './community'
import uploadImageRouter from './upload-image'

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
router.use(communityRouter)
// router.use(lecturesRouter)
// router.use(myRouter)
// router.use(vacantRouter)
// router.use(cafeteriaRouter)

export default router
