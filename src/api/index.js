const Router = require('@koa/router')

const api = new Router()
const peperoSquare = require('@/api/pepero-square')

api.use('/pepero-square', peperoSquare.routes())

module.exports = peperoSquare
