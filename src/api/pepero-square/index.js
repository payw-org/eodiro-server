const Router = require('@koa/router')
const peperoSquare = new Router()

peperoSquare.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})

module.exports = peperoSquare
