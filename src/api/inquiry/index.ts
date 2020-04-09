import {
  AnswerData,
  inquiry,
  InquiryNew,
  InquiryType,
} from '@/database/models/inquiry'
import Auth from '@/modules/auth'
import EodiroMailer from '@/modules/eodiro-mailer'
import express from 'express'

const router = express.Router()

router.post('/inquiry', async (req, res) => {
  const inquiryNew: InquiryNew = req.body
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)
  const userId = (payload ? payload.userId : null) as number | null
  const Inquiry = await inquiry()
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

router.get('/inquiry', async (req, res) => {
  const payload = await Auth.isSignedUser(req.headers.accesstoken as string)
  if (!payload) {
    res.sendStatus(401)
    return
  }
  const amount = parseInt(req.query?.offset as string, 10) || 20
  const offset = parseInt(req.query?.offset as string, 10) || 0
  const Inquiry = await inquiry()
  let inquiries: InquiryType[] | false
  if (payload.isAdmin) {
    inquiries = await Inquiry.getAll(amount, offset)
  } else {
    inquiries = await Inquiry.getFromUserId(payload.userId, amount, offset)
  }

  if (!inquiries) {
    res.sendStatus(500)
    return
  }
  res.status(200).json(inquiries)
})

router.post('/inquiry/answer', async (req, res) => {
  const payload = await Auth.isSignedUser(req.headers.accesstoken as string)

  if (!payload || !payload.isAdmin) {
    res.sendStatus(401)
    return
  }

  const answerData: AnswerData = req.body
  const Inquiry = await inquiry()
  const isUpdated = await Inquiry.updateInquiry(answerData)
  if (!isUpdated) {
    res.sendStatus(500)
    return
  }
  const inquiryData = await Inquiry.getFromInquiryId(answerData.inquiryId)
  if (!inquiryData) {
    res.sendStatus(500)
    return
  }
  EodiroMailer.sendMail({
    to: inquiryData.email,
    subject: `
            title : ${inquiryData.title}
            body : ${inquiryData.body}
            answer : ${answerData.answer}
        `,
  })
  res.sendStatus(200)
})

export default router
