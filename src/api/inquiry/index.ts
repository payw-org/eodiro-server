import express from 'express'
import Auth from '@/modules/auth'
import EodiroMailer from '@/modules/eodiro-mailer'
import { InquiryNew, AnswerData } from '@/db/inquiry'
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

router.get('/inquiry', async (req, res) => {
  const userId = await Auth.isSignedUser(req.headers.accesstoken as string)

  if (!userId) {
    res.sendStatus(401)
    return
  }

  const inquirys = await Inquiry.getFromUserId(userId)

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
