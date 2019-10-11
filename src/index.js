require('dotenv').config()
require('module-alias/register')
require('@/db')

const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()
const api = require('@/api')

router.use('', api.routes())

app.use(router.routes())
app.use(router.allowedMethods())

const port = 4000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
