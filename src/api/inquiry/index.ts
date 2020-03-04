import Inquiry, { AnswerData, InquiryNew } from '@/db/inquiry'
import Auth from '@/modules/auth'
import EodiroMailer from '@/modules/eodiro-mailer'
import express from 'express'

const router = express.Router()

router.post('/inquiry', async (req, res) => {
  const inquiryNew: InquiryNew = req.body
  const accessToken = req.headers.accesstoken as string
  const payload = await Auth.isSignedUser(accessToken)
  const userId = (payload ? payload.userId : null) as number | null
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

  const inquirys = await Inquiry.getFromUserId(payload.userId)

  if (!inquirys) {
    res.sendStatus(500)
    return
  }
  res.status(200).json(inquirys)
})

router.patch('/inquiry', async (req, res) => {
  //TODO : check master auth
  const isMaster = true

  if (!isMaster) {
    res.sendStatus(401)
    return
  }

  const answerData: AnswerData = req.body
  const isUpdated = await Inquiry.update(answerData)
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
