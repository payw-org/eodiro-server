import express from 'express'
import peperoSquareRouter from '@/api/pepero-square'
import authRouter from '@/api/auth'
import uploadRouter from '@/api/upload'

const router = express.Router()

router.use('/pepero-square', peperoSquareRouter)
router.use('/auth', authRouter)
router.use(uploadRouter)

export default router
