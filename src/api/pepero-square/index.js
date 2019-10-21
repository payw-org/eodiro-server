const express = require('express')
const router = express.Router()
const conn = require('@/db/db-connector').getConnection()

router.get('/', (req, res) => {
  // ctx.body = 'pepero square API'
  res.send('hello pepero-square')
})

// Get posts data
router.get('/posts', async (req, res) => {
  const body = await new Promise((resolve, reject) => {
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

  res.send(body)
})

// Upload a new post
router.post('/posts', async (req, res) => {
  console.log('upload a new post')
  const body = await new Promise((resolve, reject) => {
    const requestBody = req.body
    console.log(requestBody)
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

  res.send(body)
})

// Update post data
router.patch('/posts', async (req, res) => {
  const body = await new Promise((resolve, reject) => {
    const requestBody = req.body
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

  res.send(body)
})

module.exports = router
