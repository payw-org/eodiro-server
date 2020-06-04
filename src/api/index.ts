import Auth from '@/modules/auth'
import { OneApiError } from './one/scheme/types/utils'
import authRouter from '@/api/auth'
import cafeteriaRouter from '@/api/cafeteria'
import express from 'express'
import inquiryRouter from '@/api/inquiry'
import lecturesRouter from '@/api/lectures'
import myRouter from '@/api/my'
import { oneAPI } from './one'
import peperoSquareRouter from '@/api/pepero-square'
import uploadRouter from '@/api/upload'
import vacantRouter from '@/api/vacant'

const router = express.Router()

router.get('/', (...ctx) => {
  const res = ctx[1]
  res.send(`<pre>
eodiro API 2
<a href="https://github.com/paywteam/eodiro-api2">Documentation</a>
</pre>`)
})

// Single end point for all APIs
router.post('/one', async (req, res) => {
  const { action, data = {} } = req.body
  const { accesstoken: accessToken } = req.headers

  // If requested with an access token, verify firstly,
  // then pass auth payload to all of the actions universally
  if (accessToken) {
    const authPayload = await Auth.isSignedUser(accessToken as string)

    if (!authPayload) {
      res.json({
        err: OneApiError.UNAUTHORIZED,
      })
      return
    }

    data.authPayload = authPayload

    /** @deprecated For older One APIs */
    data.accessToken = accessToken
  }

  const payload = await oneAPI({
    action,
    data,
  })

  if (!payload) {
    res.json({
      err: 'No Action Found',
    })
    return
  }

  res.json(payload)
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
