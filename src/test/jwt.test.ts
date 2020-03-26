import config from '@/config'
import { refreshToken } from '@/database/models/refresh_token'
import { getUser } from '@/database/models/user'
import Db from '@/db'
import Auth from '@/modules/auth'
import Jwt, { Payload } from '@/modules/jwt'
import { expect } from 'chai'
import { JwtError, Tokens } from 'jwt-token'
import { describe } from 'mocha'

const RefreshTokenOption = {
  secret: config.REFRESH_TOKEN_SECRET,
  expire: config.REFRESH_TOKEN_EXPIRE,
  refreshTokenOption: {
    refreshRefreshTokenAllowedUnit: config.REFRESH_TOKEN_REFRESH_ALLOWED_UNIT,
    refreshRefreshTokenAllowedValue: config.REFRESH_TOKEN_REFRESH_ALLOWED_VALUE,
  },
}
const AccessTokenOption = {
  secret: config.ACCESS_TOKEN_SECRET,
  expire: config.ACCESS_TOKEN_EXPIRE,
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
    it('expect to return same refreshToken and different accessToken from first tokens', async () => {
      await sleep(1000)
      const secondTokens = await Jwt.getTokenOrCreate(TestPayload)
      expect(secondTokens.accessToken.token).to.not.equal(
        firstTokens.accessToken.token
      )
      expect(secondTokens.refreshToken).to.deep.equal(firstTokens.refreshToken)
    })
    it('expect to return new refreshToken when the refreshToken in the db is expired', async () => {
      const RefreshTokenTable = await refreshToken()
      await RefreshTokenTable.deleteRefreshToken(TestPayload.userId)
      const shortExpireRefreshTokenOption = {
        ...RefreshTokenOption,
      }
      shortExpireRefreshTokenOption.expire = '1s'
      const shortExpireRefreshTokens = await Jwt.getTokenOrCreate(
        TestPayload,
        shortExpireRefreshTokenOption
      )
      await sleep(1000)
      const newTokens = await Jwt.getTokenOrCreate(
        TestPayload,
        RefreshTokenOption
      )
      expect(newTokens.refreshToken.token).to.not.equal(
        shortExpireRefreshTokens.refreshToken.token
      )
    })
  })

  describe('# verify', () => {
    it('expect to return payload when the accessToken is normal', async () => {
      const normalTokens = await Jwt.getTokenOrCreate(TestPayload)
      const result = await Jwt.verify(normalTokens.accessToken.token)
      expect(result).not.be.a('boolean')
      expect(result).deep.equal(TestPayload)
    })
    it('expect return false when the accessToken is expired', async () => {
      const shortExpireAccessTokenOption = {
        ...AccessTokenOption,
      }
      shortExpireAccessTokenOption.expire = '1s'
      const shortExpireTokens = await Jwt.getTokenOrCreate(
        TestPayload,
        RefreshTokenOption,
        shortExpireAccessTokenOption
      )
      await sleep(1000)
      const result = await Jwt.verify(shortExpireTokens.accessToken.token)
      expect(result).be.a('boolean')
      expect(result).to.equal(false)
    })
    it('expect return false when the accessToken is created before manually changed', async () => {
      const firstTokens = await Jwt.getTokenOrCreate(TestPayload)
      const RefreshTokenTable = await refreshToken()
      await RefreshTokenTable.deleteRefreshToken(TestPayload.userId)
      const result = await Jwt.verify(firstTokens.accessToken.token)
      expect(result).to.be.a('boolean')
      expect(result).to.equal(false)
    })
  })
  describe('# refresh', async () => {
    it('expect return new accessToken and same refreshToken as the input when the refreshToken is refreshable', async () => {
      const firstTokens = await Jwt.getTokenOrCreate(TestPayload)
      const refreshedTokens = await Jwt.refresh(firstTokens.refreshToken.token)
      expect(refreshedTokens.refreshToken).to.deep.equal(
        firstTokens.refreshToken
      )
      expect(refreshedTokens.accessToken.decoded.payload).to.deep.equal(
        TestPayload
      )
    })
    it('expect return new tokens when the refreshToken is refreshable', async () => {
      const RefreshTokenTable = await refreshToken()
      await RefreshTokenTable.deleteRefreshToken(TestPayload.userId)
      const refreshableRefreshTokenOption = {
        ...RefreshTokenOption,
      }
      refreshableRefreshTokenOption.refreshTokenOption.refreshRefreshTokenAllowedValue = 3
      refreshableRefreshTokenOption.refreshTokenOption.refreshRefreshTokenAllowedUnit =
        'day'
      refreshableRefreshTokenOption.expire = '2d'
      const refreshableTokens = await Jwt.getTokenOrCreate(
        TestPayload,
        refreshableRefreshTokenOption
      )
      const refreshedTokens = await Jwt.refresh(
        refreshableTokens.refreshToken.token
      )
      expect(refreshedTokens.refreshToken.token).to.not.equal(
        refreshableTokens.refreshToken.token
      )
      const savedTokens = await Jwt.getTokenOrCreate(TestPayload)
      expect(refreshedTokens.refreshToken.token).to.equal(
        savedTokens.refreshToken.token
      )
    })
    it('expect to throw error when the refreshToken is expired', async () => {
      const RefreshTokenTable = await refreshToken()
      await RefreshTokenTable.deleteRefreshToken(TestPayload.userId)
      const shortExpireRefreshTokenOption = {
        ...RefreshTokenOption,
      }
      shortExpireRefreshTokenOption.expire = '1s'
      const shortExpireTokens = await Jwt.getTokenOrCreate(
        TestPayload,
        shortExpireRefreshTokenOption
      )
      await sleep(1000)
      let jwtError
      await Jwt.refresh(shortExpireTokens.refreshToken.token).catch(
        (err) => (jwtError = err)
      )
      expect((jwtError as JwtError).code).to.equal(JwtError.ERROR.EXPIRED_JWT)
    })

    it('expect to throw error when the refreshToken is not exists in db', async () => {
      const firstTokens = await Jwt.getTokenOrCreate(TestPayload)
      const RefreshTokenTable = await refreshToken()
      await RefreshTokenTable.deleteRefreshToken(TestPayload.userId)
      let jwtError
      await Jwt.refresh(firstTokens.refreshToken.token).catch((err) => {
        jwtError = err
      })
      expect((jwtError as JwtError).code).to.equal(
        JwtError.ERROR.NO_RESULT_OF_GET_REFRESHTOKEN
      )
    })

    it('expect to throw error when the refreshToken is created before manually changed', async () => {
      const firstTokens = await Jwt.getTokenOrCreate(TestPayload)
      const RefreshTokenTable = await refreshToken()
      await RefreshTokenTable.deleteRefreshToken(TestPayload.userId)
      await sleep(1000)
      await Jwt.getTokenOrCreate(TestPayload)
      let jwtError
      await Jwt.refresh(firstTokens.refreshToken.token).catch((err) => {
        jwtError = err
      })
      expect((jwtError as JwtError).code).to.equal(
        JwtError.ERROR.CREATED_BEFORE_BEING_MANUALLY_CHANGED
      )
    })
  })
})
