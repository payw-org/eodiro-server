const Router = require('@koa/router')
const peperoSquare = new Router()
const conn = require('@/db/db-connector').getConnection()

peperoSquare.get('/', (ctx, next) => {
  // ctx.body = 'pepero square API'
  let n = ctx.session.views || 0
  ctx.session.views = ++n
  ctx.body = n + ' views'
})

// Get posts data
peperoSquare.get('/posts', async (ctx, next) => {
  ctx.body = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM posts ORDER BY id DESC'

    conn.query(sql, (err, results) => {
      if (err) {
        resolve({
          err: err.stack
        })
      }

      resolve({
        err: false,
        rows: results
      })
    })
  })
})

// Upload a new post
peperoSquare.post('/posts', async (ctx, next) => {
  ctx.body = await new Promise((resolve, reject) => {
    const requestBody = ctx.request.body
    const { title, body, authorId, uploadedAt } = requestBody

    if (!title) {
      resolve({
        err: 'no title'
      })
      return
    }

    if (!body) {
      resolve({
        err: 'no body'
      })
      return
    }

    const query =
      'INSERT INTO posts (title, body, author_id, uploaded_at) VALUES (?, ?, ?, ?)'
    const values = [title, body, authorId, uploadedAt]

    conn.query(query, values, (err, results) => {
      if (err) {
        resolve({
          err: err.stack
        })
        return
      }

      resolve({
        err: false,
        insertedId: results.insertId
      })
    })
  })
})

// Update post data
peperoSquare.patch('/posts', async (ctx, next) => {
  ctx.body = await new Promise((resolve, reject) => {
    const requestBody = ctx.request.body
    const { postId, title, body } = requestBody

    const query = 'UPDATE posts SET title = ?, body = ? WHERE id = ?'
    const values = [title, body, postId]

    conn.query(query, values, (err, results) => {
      if (err) {
        resolve({
          err: err.stack
        })
      }

      resolve({
        err: false
      })
    })
  })
})

module.exports = peperoSquare
