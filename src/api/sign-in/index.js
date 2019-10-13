const Router = require('@koa/router')
const signIn = new Router()
const Auth = require('@/modules/auth')

signIn.get('/', async (ctx, next) => {
  ctx.body = await Auth.login(ctx.session, ctx.request.body)
})

module.exports = signIn
