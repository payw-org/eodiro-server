import express from 'express'

const router = express.Router()
const conn = require('@/modules/db-connector').getConnection()

router.get('/', (req, res) => {
  // ctx.body = 'pepero square API'
  if (!req.session.count) {
    req.session.count = 0
  }
  req.session.count++
  res.json(req.session.count)
})

// Get posts data
router.get('/posts', async (req, res) => {
  const sql = `
    SELECT *
    FROM post
    ORDER BY id DESC
  `
  const [results] = await conn.execute(sql)

  res.json(results)
})

// Upload a new post
router.post('/posts', async (req, res) => {
  const { title, body, authorId, uploadedAt } = req.body

  if (!title) {
    res.json({
      err: 'no title'
    })
    return
  }

  if (!body) {
    res.json({
      err: 'no body'
    })
    return
  }

  const sql = `
    INSERT INTO post
    (title, body, author_id, uploaded_at)
    VALUES (?, ?, ?, ?)
  `
  const values = [title, body, authorId, uploadedAt]
  const [results] = await conn.query(sql, values)

  res.json(results)
})

// Update post data
router.patch('/posts', async (req, res) => {
  const { postId, title, body } = req.body

  const sql = `
    UPDATE post
    SET title = ?, body = ? WHERE id = ?
  `
  const values = [title, body, postId]
  const [results] = await conn.query(sql, values)

  res.json(results)
})

export default router
