const express = require('express')
const router = express.Router()
const Auth = require('@/modules/auth')

const Bot = require('@/modules/bot')
const bot = new Bot()
bot.clearPendingUsers()

// Sign up
router.post('/signup', async (req, res) => {
  const requestData = req.body
  const result = await Auth.signUp(requestData)
  res.send(result)
})

// Verify pending user
router.get('/verify', async (req, res) => {
  const requestData = req.body
  const result = await Auth.verifyPendingUser(requestData.token)
  res.json(result)
})

// Sign in
router.get('/signin', async (req, res) => {
  const result = await Auth.signIn(req.session, req.body)
  res.send(result)
})

// Sign out
router.get('/signout', (req, res) => {
  const result = Auth.signOut(req.session)
  res.send(result)
})

module.exports = router
