const Router = require('@koa/router')
const peperoSquare = new Router()
const conn = require('@/db/DBConnector').getConnection()

peperoSquare.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})

peperoSquare.get('/posts', async (ctx, next) => {
  ctx.body = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users'

    conn.query(sql, (err, results) => {
      if (err) {
        reject(err.stack)
      }

      resolve(results)
    })
  })
})

module.exports = peperoSquare
