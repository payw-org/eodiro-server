import { comment } from '@/database/models/comment'
import { getPost, PostNew, PostUpdate } from '@/database/models/post'
import Auth from '@/modules/auth'
import express from 'express'

const router = express.Router()

// Get posts data
router.get('/posts', async (req, res) => {
  const { quantity } = req.query
  let { from } = req.query

  if (from === undefined) {
    from = 0
  }

  const Post = await getPost()
  const posts = await Post.getPosts(Number(from), Number(quantity))

  if (posts) {
    res.status(200).json(posts)
  } else {
    res.sendStatus(500)
  }
})

// Get recent posts
router.get('/posts/recent', async (req, res) => {
  const { from } = req.query

  if (from === undefined) {
    res.sendStatus(400)
    return
  }

  const Post = await getPost()
  const posts = await Post.getRecentPosts(Number(from))

  if (posts) {
    res.status(200).json(posts)
  } else {
    res.sendStatus(500)
  }
})

// Get a post data
router.get('/post', async (req, res) => {
  // Unauthorized user or not signed in
  const payload = await Auth.isSignedUser(req.headers.accesstoken as string)

  if (!payload) {
    res.sendStatus(401)
    return
  }

  const { postId } = req.query
  const Post = await getPost()
  const postItem = await Post.getFromId(Number(postId))

  if (postItem) {
    res.status(200).json(postItem)
  } else {
    res.sendStatus(500)
  }
})

// Upload a new post
router.post('/post', async (req, res) => {
  // Unauthorized user or not signed in
  const payload = await Auth.isSignedUser(req.headers.accesstoken as string)

  if (!payload) {
    res.sendStatus(401)
    return
  }

  // Validate post content
  const postData: PostNew = req.body
  const Post = await getPost()
  const postId = await Post.upload(payload.userId, postData)

  if (postId) {
    res.status(201).json({
      postId,
    })
  } else {
    res.sendStatus(400)
  }
})

// Update post data
router.patch('/posts', async (req, res) => {
  // Not signed in
  if (!(await Auth.isSignedUser(req.headers.accesstoken as string))) {
    res.sendStatus(401)
    return
  }

  const refinedData: PostUpdate = req.body
  const userId = undefined
  const Post = await getPost()
  const isOwnedByUser = await Post.isOwnedBy(refinedData.postId, userId)

  if (!isOwnedByUser) {
    res.sendStatus(401)
    return
  }

  const isUpdated = await Post.updatePost(refinedData)

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
  const userId = undefined
  const Post = await getPost()
  if (
    !(await Auth.isSignedUser(req.headers.accesstoken as string)) ||
    !(await Post.isOwnedBy(postId, userId))
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
router.get('/post/comments', async (req, res) => {
  // Unauthorized user or not signed in
  const payload = await Auth.isSignedUser(req.headers.accesstoken as string)

  if (!payload) {
    res.sendStatus(401)
    return
  }

  const { postId, fromId } = req.query
  const Post = await getPost()
  const comments = await Post.getCommentsOf(Number(postId), Number(fromId))

  if (!comments) {
    res.sendStatus(500)
    return
  }

  res.status(200).json(comments)
})

// Upload a comment
router.post('/post/comment', async (req, res) => {
  // Unauthorized user or not signed in
  const payload = await Auth.isSignedUser(req.headers.accesstoken as string)

  if (!payload) {
    res.sendStatus(401)
    return
  }

  const commentData = req.body
  const Comment = await comment()
  const isUploaded = await Comment.add(payload.userId, commentData)

  if (!isUploaded) {
    res.sendStatus(500)
  } else {
    res.sendStatus(200)
  }
})

export default router
