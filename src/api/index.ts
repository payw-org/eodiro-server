import express from 'express'
import authRouter from './auth'
import communityRouter from './community'
import my from './my'
import noticeNotifications from './notice-notifications'
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

router.use('/auth', authRouter)
router.use('/community', communityRouter)
router.use('/my', my)
router.use('/notice-notifications', noticeNotifications)
router.use('/upload-image', uploadImageRouter)
// router.use(lecturesRouter)
// router.use(vacantRouter)
// router.use(cafeteriaRouter)

export default router
