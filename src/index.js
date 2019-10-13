require('dotenv').config()
require('module-alias/register')

const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const bodyParser = require('koa-bodyparser')
const router = new Router()
const session = require('koa-session')
const api = require('@/api')

app.keys = ['secret']
const sessionConfig = {
  key: 'eodiro_api2_session',
  renew: true
}
app.use(session(sessionConfig, app))
app.use(bodyParser())
router.use('', api.routes())
app.use(router.routes())
app.use(router.allowedMethods())

const port = 4000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
