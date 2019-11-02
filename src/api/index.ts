import express from 'express'
import peperoSquareRouter from '@/api/pepero-square'
import authRouter from '@/api/auth'

const router = express.Router()

router.use('/pepero-square', peperoSquareRouter)
router.use('/auth', authRouter)

export default router
