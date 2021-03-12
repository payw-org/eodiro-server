import { requireAuth } from '@/middleware/require-auth'
import express from 'express'
import allBoards from './all-boards'
import board from './board'
import boardName from './board-name'
import bookmarkPost from './bookmark-post'
import comment from './comment'
import likePost from './like-post'
import pinnedBoards from './pinned-boards'
import popularPosts from './popular-posts'
import post from './post'
import postsList from './posts-list'
import recentBoards from './recent-boards'
import voteBoardCandidate from './vote-board-candidate'

const router = express.Router()

router.use(requireAuth)

router.use(allBoards)
router.use(boardName)
router.use(board)
router.use(bookmarkPost)
router.use(comment)
router.use(likePost)
router.use(pinnedBoards)
router.use(popularPosts)
router.use(post)
router.use(postsList)
router.use(recentBoards)
router.use(voteBoardCandidate)

export default router
