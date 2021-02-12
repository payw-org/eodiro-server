import express from 'express'
import changePassword from './change-password'
import forgot from './forgot'
import join from './join'
import signIn from './log-in'
import refresh from './refresh'
import validate from './validate'
import verify from './verify'

const router = express.Router()

router.use(changePassword)
router.use(forgot)
router.use(join)
router.use(signIn)
router.use(verify)
router.use(refresh)
router.use(validate)

export default router
