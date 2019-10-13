const Router = require('@koa/router')
const authRouter = new Router()
const Auth = require('@/modules/auth')

authRouter.get('/sign-in', async (ctx, next) => {
  ctx.body = await Auth.signin(ctx.session, ctx.request.body)
})

authRouter.post('/register', async (ctx, next) => {})

module.exports = authRouter
