import Config from '@@/config'
import { JwtToken } from './jwt-token'
import dayjs = require('dayjs')

export class RefreshToken<T> extends JwtToken<T> {
  constructor(config: { token?: string, payload?: T }) {
    super()
    if (config.payload !== undefined) {
      this.create(config.payload)
    }
    if (config.token !== undefined) {
      super(config.token)
      this.verify()
    }
  }

  create(payload: T): void {
    super.create(
      payload,
      Config.REFRESH_TOKEN_SECRET,
      Config.REFRESH_TOKEN_EXPIRE
    )
    this.verify()
  }

  verify(): void {
    super.verify(Config.REFRESH_TOKEN_SECRET)
  }

  isAllowedRefresh(): boolean {
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

  refreshRefreshTokenIfPossible(): boolean {
    const isAllowed = this.isAllowedRefresh()
    if (isAllowed) {
      this.create(this.decoded.payload)
    }
    return isAllowed
  }
}
