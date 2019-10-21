const express = require('express')
const router = express.Router()
const peperoSquareRouter = require('@/api/pepero-square')
const authRouter = require('@/api/auth')

router.use('/pepero-square', peperoSquareRouter)
router.use('/auth', authRouter)

module.exports = router
