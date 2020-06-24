import Auth from '@/modules/auth'
import { OneApiError } from './one/types'
import authRouter from '@/api/auth'
import cafeteriaRouter from '@/api/cafeteria'
import express from 'express'
import inquiryRouter from '@/api/inquiry'
import lecturesRouter from '@/api/lectures'
import myRouter from '@/api/my'
import { oneApi } from './one'
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

  // If requested with an access token, verify firstly,
  // then pass auth payload to all of the actions universally
  if ('accesstoken' in req.headers) {
    const accessToken = req.headers.accesstoken

    const authPayload = await Auth.isSignedUser(accessToken as string)

    if (!authPayload) {
      // For debugging
      console.log('Unauthorized')

      res.json({
        err: OneApiError.UNAUTHORIZED,
        data: null,
      })
      return
    }

    data.authPayload = authPayload

    /** @deprecated For older One APIs */
    data.accessToken = accessToken
  }

  let payload: unknown

  try {
    payload = await oneApi({
      action,
      data,
    })
  } catch (err) {
    // For debugging
    console.log(err)

    res.json({
      err: OneApiError.INTERNAL_SERVER_ERROR,
      errMsg: err.message,
      data: null,
    })
    return
  }

  if (!payload) {
    // For debugging
    console.log('No action found')

    res.json({
      err: 'No Action Found',
      data: null,
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
