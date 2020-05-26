import {
  DecodeTokenOption,
  Jwt,
  JwtToken,
  RefreshToken,
  RefreshTokenOption,
  TokenOption,
  Tokens,
} from 'jwt-token'

import config from '@/config'
import { refreshToken as refreshTokenTable } from '@/database/models/refresh_token'

export interface Payload {
  userId: number
  isAdmin: boolean
}

export default class EodiroJwt {
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

  private static async getRefreshTokenFromDb(userId: number) {
    const RefreshTokenTable = await refreshTokenTable()
    const row = await RefreshTokenTable.findWithUserId(userId)
    if (row === false || row === undefined) {
      return undefined
    }
    return row
  }

  static async getTokenOrCreate(
    payload: Payload,
    refreshTokenOption: RefreshTokenOption<Payload> = this.RefreshTokenOption,
    accessTokenOption: TokenOption<Payload> = this.AccessTokenOption
  ): Promise<Tokens<Payload>> {
    return Jwt.getTokenOrCreateTokens(
      payload,
      refreshTokenOption,
      {
        payload,
        ...accessTokenOption,
      },
      async (): Promise<string | undefined> => {
        const row = await this.getRefreshTokenFromDb(payload.userId)
        return row === undefined ? undefined : row.token
      },
      async (refreshToken: RefreshToken<Payload>) => {
        const RefreshTokenTable = await refreshTokenTable()
        await RefreshTokenTable.addRefreshToken(refreshToken)
      },
      async (refreshToken: RefreshToken<Payload>) => {
        const RefreshTokenTable = await refreshTokenTable()
        await RefreshTokenTable.updateRefreshToken(refreshToken)
      }
    )
  }

  static async verify(
    token: string,
    accessTokenOption: TokenOption<Payload> = this.AccessTokenOption
  ): Promise<Payload | false> {
    let result = {} as Payload
    try {
      result = await Jwt.verifyAccessToken<Payload>(
        {
          token,
          ...accessTokenOption,
        } as DecodeTokenOption,
        async (accessToken: JwtToken<Payload>): Promise<number> => {
          const row = await this.getRefreshTokenFromDb(
            accessToken.decoded.payload.userId
          )
          return row === undefined ? undefined : row.manually_changed_at
        }
      )
    } catch (err) {
      return false
    }
    return result
  }

  static async refresh(
    token: string,
    refreshTokenOption: RefreshTokenOption<Payload> = this.RefreshTokenOption,
    accessTokenOption: TokenOption<Payload> = this.AccessTokenOption
  ): Promise<Tokens<Payload>> {
    const result = Jwt.refresh(
      token,
      refreshTokenOption,
      accessTokenOption,
      async (refreshToken: RefreshToken<Payload>) => {
        const row = await this.getRefreshTokenFromDb(
          refreshToken.decoded.payload.userId
        )
        return row === undefined
          ? undefined
          : {
              manuallyChangedAt: row.manually_changed_at,
              refreshToken: row.token,
            }
      },
      async (refreshToken: RefreshToken<Payload>) => {
        const RefreshTokenTable = await refreshTokenTable()
        await RefreshTokenTable.updateRefreshToken(refreshToken)
      }
    )
    return result
  }
}
