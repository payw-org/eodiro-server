const express = require('express')
const router = express.Router()
const Auth = require('@/modules/auth')

router.get('/sign-in', async (req, res) => {
  const body = await Auth.signIn(null, req.body)
  res.send(body)
})

router.post('/sign-up', async (req, res) => {
  const requestData = req.body
  const body = await Auth.signUp(requestData)
  res.send(body)
})

router.get('/sign-out', (req, res) => {
  const body = Auth.signOut(null)
  res.send(body)
})

module.exports = router
