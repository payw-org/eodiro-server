import Db from '@/db'
import ChangePassword from '@/db/change-password'
import User from '@/db/user'
import Auth from '@/modules/auth'
import EodiroMailer from '@/modules/eodiro-mailer'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.post('/change-password', async (req, res) => {
  const portalId = req.body.portalId as string

  const user = await User.findWithPortalId(portalId)
  if (!user) {
    res.sendStatus(401)
    return
  }

  const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~' //`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'
  let tempKey = ''
  let isExist = true
  while (isExist) {
    tempKey = ''
    for (let i = 0; i < 30; i++)
      tempKey += mask[Math.floor(Math.random() * mask.length)]
    const result = await ChangePassword.findWithTempKey(tempKey)
    if (!result) {
      isExist = false
    } else if (dayjs().isAfter(dayjs(result.created_at).add(30, 'minute'))) {
      await ChangePassword.deleteWidthTempKey(tempKey)
      isExist = false
    }
  }
  const result = await ChangePassword.createOrUpdateTempKey(user.id, tempKey)

  if (!result) {
    res.sendStatus(500)
    return
  }
  EodiroMailer.sendMail({
    to: portalId,
    subject: '어디로 비밀번호 변경 이메일입니다',
    html: `<a href="https://eodiro.com/auth/change-password/request/?tk=${tempKey}">비밀번호변경</a>`,
  })
  res.sendStatus(200)
})

router.post('/change-password/request', async (req, res) => {
  const tempKey = Db.escape(req.query?.tk)

  const changePassword = await ChangePassword.findWithTempKey(tempKey)
  if (!changePassword) {
    res.sendStatus(401)
    return
  }
  const expire = dayjs(changePassword.created_at).add(30, 'minute')
  if (dayjs().isAfter(expire)) {
    await ChangePassword.deleteWidthTempKey(tempKey)
    res.json(false)
  }
  const newPassword = req.body.newPassword
  if (!Auth.isValidPassword(newPassword)) {
    res.json(false)
    return
  }

  const result = await User.updatePassword(changePassword.user_id, newPassword)
  if (!result) {
    res.sendStatus(500)
    return
  }
  res.json(true)
})

export default router
