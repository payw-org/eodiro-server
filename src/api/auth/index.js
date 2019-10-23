const express = require('express')
const router = express.Router()
const Auth = require('@/modules/auth')

const Bot = require('@/modules/bot')
const bot = new Bot()
bot.clearPendingUsers()

router.get('/sign-in', async (req, res) => {
  const result = await Auth.signIn(req.session, req.body)
  res.send(result)
})

router.post('/sign-up', async (req, res) => {
  const requestData = req.body
  const result = await Auth.signUp(requestData)
  res.send(result)
})

router.get('/sign-out', (req, res) => {
  const result = Auth.signOut(req.session)
  res.send(result)
})

module.exports = router
