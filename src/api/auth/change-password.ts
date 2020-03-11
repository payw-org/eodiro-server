import Db from '@/db'
import ChangePassword from '@/db/change-password'
import User from '@/db/user'
import Auth from '@/modules/auth'
import { HttpStatusCode } from '@/modules/constants/http-status-code'
import EodiroMailer from '@/modules/eodiro-mailer'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.post('/change-password', async (req, res) => {
  const portalId = req.body.portalId as string
  const user = await User.findWithPortalId(portalId)

  if (user === false) {
    res.sendStatus(500)
    return
  }

  if (user === undefined) {
    res.sendStatus(401)
    return
  }

  const token = await ChangePassword.createOrUpdateToken(user.id)

  if (token === undefined) {
    res.sendStatus(500)
    return
  }

  EodiroMailer.sendMail({
    to: user.portal_id,
    subject: '어디로 암호 변경 이메일입니다',
    html: `<a href="https://eodiro.com/forgot/change-password?t=${token}">비밀번호변경</a>`,
  })

  res.sendStatus(200)
})

router.get('/change-password', async (req, res) => {
  const token = Db.escape(req.body.token)
  const request = await ChangePassword.findWithToken(token)

  if (request === false) {
    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
    return
  }

  if (dayjs().isAfter(dayjs(request.requested_at).add(30, 'minute'))) {
    await ChangePassword.deleteWithToken(token)
    res.json(false)
  } else {
    res.json(true)
  }
})

router.patch('/change-password', async (req, res) => {
  const token = Db.escape(req.body.token)
  const newPassword = Db.escape(req.body.newPassword)

  const changePasswordRequest = await ChangePassword.findWithToken(token)

  if (!changePasswordRequest) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    return
  }

  if (!Auth.isValidPassword(newPassword)) {
    res.json(false)
    return
  }

  const result = await User.updatePassword(
    changePasswordRequest.user_id,
    newPassword
  )

  if (result === undefined) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED)
  } else if (result === false) {
    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
  } else {
    await ChangePassword.deleteWithToken(token)
    res.json(true)
  }
})

export default router
