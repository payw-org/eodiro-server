import express from 'express'
import Post from '@/db/post'
import { PostNew, PostUpdate } from '@/db/post'
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
  if (!Auth.isSignedIn(req.session)) {
    res.sendStatus(401)
    return
  }

  // Validate post content

  const isUploaded = await Post.upload(req.session, postData)

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

// Delete the post
router.delete('/posts', async (req, res) => {
  const requestedBody = req.body
  const postId: number = requestedBody.postId

  if (!postId) {
    res.sendStatus(404)
    return
  }

  // Could not delete post without sign in
  // If signed in, check the post ownership
  if (
    !Auth.isSignedIn(req.session) ||
    !(await Post.isOwnedBy(postId, Auth.getSignedInUserId(req.session)))
  ) {
    res.sendStatus(401)
    return
  }

  const isDeleted = await Post.delete(requestedBody.postId)

  if (isDeleted) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

// Get comments of the post
router.get('/posts/comments', async (req, res) => {})

export default router
