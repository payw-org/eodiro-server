import express from 'express'
import changePassword from './change-password'
import forgot from './forgot'
import join from './join'
import logIn from './log-in'
import logOut from './log-out'
import refresh from './refresh'
import validate from './validate'
import verify from './verify'
import verifyJoin from './verify-join'

const router = express.Router()

router.use(changePassword)
router.use(forgot)
router.use(join)
router.use(logIn)
router.use(logOut)
router.use(refresh)
router.use(validate)
router.use(verify)
router.use(verifyJoin)

export default router
