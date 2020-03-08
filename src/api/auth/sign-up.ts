import Db from '@/db'
import Auth, { SignUpInfo } from '@/modules/auth'
import express from 'express'

const router = express.Router()

// Sign up
router.post('/sign-up', async (req, res) => {
  const signUpInfo: SignUpInfo = req.body
  const portalId = Db.escape(signUpInfo?.portalId)
  const nickname = Db.escape(signUpInfo?.nickname)
  const password = Db.escape(signUpInfo?.password)
  const validations = {
    portalId:
      (await Auth.isValidPortalId(portalId)) &&
      Auth.isValidPortalIdFormat(portalId),
    nickname: await Auth.isValidNickname(nickname),
    password: Auth.isValidPassword(password),
  }

  if (validations.portalId && validations.password && validations.nickname) {
    const signUpResult = await Auth.signUp(signUpInfo)

    if (!signUpResult) {
      res.sendStatus(500)
      return
    }
  }

  res.json(validations)
})

export default router
