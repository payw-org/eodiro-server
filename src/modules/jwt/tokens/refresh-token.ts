import Config from '@@/config'
import { JwtToken, Payload } from './jwt-token'
import dayjs = require('dayjs')

export class RefreshToken extends JwtToken {
  async create(payload: Payload): Promise<void> {
    await super.create(
      payload,
      Config.REFRESH_TOKEN_SECRET,
      Config.REFRESH_TOKEN_EXPIRE
    )
    await this.verify()
  }

  async verify(): Promise<void> {
    await super.verify(Config.REFRESH_TOKEN_SECRET)
  }

  async isAllowedRefresh(): Promise<boolean> {
    const refreshTokenExpireDate = dayjs.unix(this.decoded.exp)
    if (
      refreshTokenExpireDate.diff(
        dayjs(),
        Config.REFRESH_TOKEN_REFRESH_ALLOWED_UNIT
      ) <= Config.REFRESH_TOKEN_REFRESH_ALLOWED_VALUE
    ) {
      return true
    } else {
      return false
    }
  }

  async refreshRefreshTokenIfPossible(): Promise<boolean> {
    const isAllowed = await this.isAllowedRefresh()
    if (isAllowed) {
      await this.create(this.decoded.payload)
    }
    return isAllowed
  }
}
