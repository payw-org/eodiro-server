const Router = require('@koa/router')
const api = new Router()
const peperoSquare = require('@/api/pepero-square')
const signIn = require('@/api/sign-in')

api.use('/sign-in', signIn.routes())
api.use('/pepero-square', peperoSquare.routes())

module.exports = api
