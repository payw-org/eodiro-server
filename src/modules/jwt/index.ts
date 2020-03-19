import config from '@/config'
import { refreshToken as refreshTokenTable } from '@/database/models/refresh_token'
import { JwtError, RefreshToken } from './tokens'
import { JwtToken } from './tokens/jwt-token'

export interface Payload {
  userId: number
  isAdmin: boolean
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export default class Jwt {
  private static RefreshTokenOption = {
    secret: config.REFRESH_TOKEN_SECRET,
    expire: config.REFRESH_TOKEN_EXPIRE,
    refreshTokenOption: {
      refreshRefreshTokenAllowedUnit: config.REFRESH_TOKEN_REFRESH_ALLOWED_UNIT,
      refreshRefreshTokenAllowedValue:
        config.REFRESH_TOKEN_REFRESH_ALLOWED_VALUE,
    },
  }
  private static AccessTokenOption = {
    secret: config.ACCESS_TOKEN_SECRET,
    expire: config.ACCESS_TOKEN_EXPIRE,
  }
  static async getTokenOrCreate(payload: Payload): Promise<Tokens> {
    const result = {} as Tokens

    const RefreshTokenTable = await refreshTokenTable()
    const row = await RefreshTokenTable.findWithUserId(payload.userId)
    if (row === false || row === undefined) {
      // no refresh token in db
      const refreshToken = new RefreshToken<Payload>({
        payload,
        ...this.RefreshTokenOption,
      })
      await RefreshTokenTable.addRefreshToken(refreshToken)
      result.refreshToken = refreshToken.token
    } else {
      try {
        const refreshToken = new RefreshToken<Payload>({
          payload,
          ...this.RefreshTokenOption,
        })
        if (
          refreshToken.refreshRefreshTokenIfPossible({
            payload,
            ...this.RefreshTokenOption,
          })
        ) {
          // refreshToken is refreshed
          await RefreshTokenTable.updateRefreshToken(refreshToken)
        }
        result.refreshToken = refreshToken.token
      } catch (err) {
        const refreshToken = new RefreshToken<Payload>({
          payload,
          ...this.RefreshTokenOption,
        })
        await RefreshTokenTable.updateRefreshToken(refreshToken)
        result.refreshToken = refreshToken.token
      }
    }
    const accessToken = new JwtToken<Payload>({
      payload,
      ...this.AccessTokenOption,
    })
    result.accessToken = accessToken.token
    return result
  }

  static async verify(token: string): Promise<Payload | false> {
    const RefreshTokenTable = await refreshTokenTable()
    try {
      const accessToken = new JwtToken<Payload>({
        token,
        ...this.AccessTokenOption,
      })
      const row = await RefreshTokenTable.findWithUserId(
        accessToken.decoded.payload.userId
      )
      if (row === false || row === undefined) {
        //'no access token in db'
        return false
      } else if (row.manually_changed_at > accessToken.decoded.iat) {
        //'access token is created before being manually changed'
        return false
      }
      return accessToken.decoded.payload
    } catch (err) {
      switch (err.code) {
        case JwtError.ERROR.INVALID_JWT:
          // TODO: deal with invalid jwt case
          break
        case JwtError.ERROR.EXPIRED_JWT:
          // TODO : deal with expired jwt case
          break
        default:
          // TODO : deal with unexpected case
          break
      }
      return false
    }
  }

  static async refresh(token: string): Promise<Tokens> {
    const result = {} as Tokens
    const refreshToken = new RefreshToken<Payload>({
      token,
      ...this.RefreshTokenOption,
    })
    const RefreshTokenTable = await refreshTokenTable()
    const row = await RefreshTokenTable.findWithUserId(
      refreshToken.decoded.payload.userId
    )
    if (row === false || row === undefined) {
      throw new Error('no refersh token in db')
    } else if (row.manually_changed_at > refreshToken.decoded.iat) {
      throw new Error('refersh token is created before being manually changed')
    }
    const refreshTokenFromDb = new RefreshToken<Payload>({
      token: row.token,
      ...this.RefreshTokenOption,
    })
    const payload = refreshTokenFromDb.decoded.payload
    if (
      refreshTokenFromDb.refreshRefreshTokenIfPossible({
        payload,
        ...this.RefreshTokenOption,
      })
    ) {
      await RefreshTokenTable.updateRefreshToken(refreshTokenFromDb)
    }
    result.refreshToken = refreshTokenFromDb.token
    const accessToken = new JwtToken<Payload>({
      payload: refreshTokenFromDb.decoded.payload,
      ...this.AccessTokenOption,
    })
    result.accessToken = accessToken.token
    return result
  }
}
