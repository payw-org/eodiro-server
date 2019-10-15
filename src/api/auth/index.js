const Router = require('@koa/router')
const authRouter = new Router()
const Auth = require('@/modules/auth')

authRouter.get('/sign-in', async (ctx, next) => {
  ctx.body = await Auth.signIn(ctx.session, ctx.request.body)
})

authRouter.post('/sign-up', async (ctx, next) => {
  const requestData = ctx.request.body
  ctx.body = await Auth.signUp(requestData)
})

authRouter.get('/sign-out', (ctx, next) => {
  ctx.body = Auth.signOut(ctx.session)
})

module.exports = authRouter
