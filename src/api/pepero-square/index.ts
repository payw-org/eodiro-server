import express from 'express'
import Post from '@/db/post'
import { PostModel, PostNew, PostUpdate } from '@/db/post'
import Auth from '@/modules/auth'

const router = express.Router()

router.get('/', (req, res) => {
  res.json(req.session.userId)
})

// Get posts data
router.get('/posts', async (req, res) => {
  const posts = await Post.getPosts(0, 1000)

  if (posts) {
    res.status(200).json(posts)
  } else {
    res.sendStatus(500)
  }
})

// Upload a new post
router.post('/posts', async (req, res) => {
  const postData: PostNew = req.body

  // Unauthorized user or not signed in
  if (!Auth.isSignedUser(req.session, postData.userId)) {
    res.sendStatus(401)
    return
  }

  // Validate post content

  const isUploaded = await Post.upload(postData)

  if (isUploaded) {
    res.sendStatus(201)
  } else {
    res.sendStatus(400)
  }
})

// Update post data
router.patch('/posts', async (req, res) => {
  // Not signed in
  if (!Auth.isSignedIn(req.session)) {
    res.sendStatus(401)
    return
  }

  const refinedData: PostUpdate = req.body
  const isOwnedByUser = await Post.isOwnedBy(
    refinedData.postId,
    Auth.getSignedInUserId(req.session)
  )

  if (!isOwnedByUser) {
    res.sendStatus(401)
    return
  }

  const isUpdated = await Post.update(refinedData)

  if (isUpdated) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

router.get('/posts/comments', async (req, res) => {})

export default router
