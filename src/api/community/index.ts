import { requireAuth } from '@/middleware/require-auth'
import express from 'express'
import allBoards from './all-boards'
import boardName from './board-name'
import pinnedBoards from './pinned-boards'
import post from './post'
import postsList from './posts-list'
import recentBoards from './recent-boards'
import voteBoardCandidate from './vote-board-candidate'

const router = express.Router()

router.use(requireAuth)

router.use(allBoards)
router.use(boardName)
router.use(pinnedBoards)
router.use(post)
router.use(postsList)
router.use(recentBoards)
router.use(voteBoardCandidate)

export default router
