import express from 'express'
import information from './information'
import isSignedIn from './is-signed-in'
import refresh from './refresh-token'
import signIn from './sign-in'
import signUp from './sign-up'
import validate from './validate'
import verify from './verify'
import changePassowrd from './change-password'

const router = express.Router()

router.use(information)
router.use(isSignedIn)
router.use(signUp)
router.use(verify)
router.use(signIn)
router.use(validate)
router.use(refresh)
router.use(changePassowrd)
export default router
