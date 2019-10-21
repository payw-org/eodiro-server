require('dotenv').config()
require('module-alias/register')

require('@/db/sequelizer')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const api = require('@/api')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(api)

const port = 4000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
