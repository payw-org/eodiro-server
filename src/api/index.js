const Router = require('@koa/router')
const api = new Router()
const peperoSquareRouter = require('@/api/pepero-square')
const authRouter = require('@/api/auth')

api.use('/pepero-square', peperoSquareRouter.routes())
api.use('/auth', authRouter.routes())

module.exports = api
