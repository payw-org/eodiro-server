require('dotenv').config()
require('module-alias/register')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const crypto = require('crypto')

const app = express()
const api = require('@/api')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: crypto.randomBytes(64).toString(),
    resave: false,
    saveUninitialized: true
  })
)
app.use(api)

const port = 4000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
