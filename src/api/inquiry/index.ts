import express from 'express'
import Auth from '@/modules/auth'
import EodiroMailer from '@/modules/eodiro-mailer'
import { InquiryNew } from '@/db/inquiry'
import Inquiry from '@/db/inquiry'

const router = express.Router()

router.post('/inquiry', async (req, res) => {
  const inquiryNew: InquiryNew = req.body
  const accessToken = req.headers.accesstoken as string
  const result = await Auth.isSignedUser(accessToken)
  const userId = (result ? result : null) as number | null
  const inquiryId = await Inquiry.upload(userId, inquiryNew)

  if (!inquiryId) {
    res.sendStatus(400)
    return
  }

  res.status(201).json({
    inquiryId,
  })
  EodiroMailer.sendMail({
    to: 'contact@payw.org',
    subject: `
        email : ${inquiryNew.email}
        title : ${inquiryNew.title}
        body : ${inquiryNew.body}
    `,
  })
})

export default router
