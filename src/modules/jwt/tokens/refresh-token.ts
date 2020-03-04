import Config from '@@/config'
import { JwtToken, Payload } from './jwt-token'

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
    const refreshTokenExpireDate = new Date(this.decoded.exp * 1000).getTime()
    const nowDate = new Date().getTime()
    const differenceDate = Math.floor(
      (refreshTokenExpireDate - nowDate) / (1000 * 60 * 60 * 24)
    )
    if (differenceDate <= Config.REFRESH_TOKEN_REFRESH_ALLOWED_DAY) {
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
