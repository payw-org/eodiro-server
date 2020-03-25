import { getUser } from '@/database/models/user'
import Db from '@/db'
import Auth from '@/modules/auth'
import Jwt, { Payload } from '@/modules/jwt'
import { expect } from 'chai'
import { Tokens } from 'jwt-token'
import { describe } from 'mocha'

const RefreshTokenOption = {
  secret: 'refresh secret',
  expire: '14d',
  refreshTokenOption: {
    refreshRefreshTokenAllowedUnit: 'day',
    refreshRefreshTokenAllowedValue: '3',
  },
}
const AccessTokenOption = {
  secret: 'access secret',
  expire: '1d',
}

const TestPayload = {
  userId: 0,
  isAdmin: false,
}
const TestUser = {
  portalId: 'eodiro-jwt-test@cau.ac.kr',
  password: 'eodiro-password',
  nickname: 'eodiro-test',
}

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('# Jwt test', () => {
  before('Create test user', async () => {
    const User = await getUser()
    const token = await User.addPendingUser(TestUser)
    expect(token).to.not.equal(false)
    await Auth.verifyPendingUser(token as string)
    const userId = (await Auth.signIn(TestUser))[0]
    TestPayload.userId = userId
  })
  after('Remove test user', async () => {
    const query = `DELETE FROM user WHERE portal_id = ?`
    await Db.query(query, TestUser.portalId)
  })
  describe('# getTokenOrCreate', async () => {
    let firstTokens: Tokens<Payload> = {} as Tokens<Payload>
    it('expect to return tokens that has same decoded payload with input as first token', async () => {
      firstTokens = await Jwt.getTokenOrCreate(TestPayload)
      expect(firstTokens.accessToken.decoded.payload).to.deep.equal(TestPayload)
    })
    it('expect to return same accessToken and different accessToken from first tokens', async () => {
      await sleep(100)
      const secondTokens = await Jwt.getTokenOrCreate(TestPayload)
      expect(secondTokens.accessToken.token).to.not.equal(
        firstTokens.accessToken.token
      )
      expect(secondTokens.refreshToken.token).to.equal(
        firstTokens.refreshToken.token
      )
    })
  })
})
