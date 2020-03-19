import { changePassword } from '@/database/models/change_password'
import { user } from '@/database/models/user'
import Auth from '@/modules/auth'
import { HttpStatusCode } from '@/modules/constants/http-status-code'
import EodiroMailer from '@/modules/eodiro-mailer'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.post('/change-password', async (req, res) => {
  const portalId = req.body.portalId as string
  const User = await user()
  const userInfo = await User.findWithPortalId(portalId)

  if (userInfo === false) {
    res.sendStatus(500)
    return
  }

  if (userInfo === undefined) {
    res.sendStatus(401)
    return
  }

  const ChangePassword = await changePassword()
  const token = await ChangePassword.createOrUpdateToken(userInfo.id)

  if (token === undefined) {
    res.sendStatus(500)
    return
  }

  EodiroMailer.sendMail({
    to: userInfo.portal_id,
    subject: '어디로 암호 변경 이메일입니다',
    html: `<a href="https://eodiro.com/forgot/change-password?t=${token}">비밀번호변경</a>`,
  })

  res.sendStatus(200)
})

router.get('/change-password', async (req, res) => {
  const token = req.body.token
  const ChangePassword = await changePassword()
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
  const token = req.body.token
  const newPassword = req.body.newPassword

  const ChangePassword = await changePassword()
  const changePasswordRequest = await ChangePassword.findWithToken(token)

  if (!changePasswordRequest) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    return
  }

  if (!Auth.isValidPassword(newPassword)) {
    res.json(false)
    return
  }

  const User = await user()
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
