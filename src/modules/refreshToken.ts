import JwtToken, { Payload } from '@/modules/jwtToken'
import Config from '@@/config'

export default class RefreshToken extends JwtToken {

  async create(payload: Payload) {
    await super.create(
      payload,
      Config.REFRESH_TOKEN_SECRET,
      Config.REFRESH_TOKEN_EXPIRE
    )
    await this.verify()
  }

  async verify() {
    await super.verify(Config.REFRESH_TOKEN_SECRET)
  }

  async isAllowedRefresh() {
    const refreshTokenExpireDate = new Date(this.decoded.exp * 1000).getTime()
    const nowDate = new Date().getTime()
    const differenceDate = Math.floor((refreshTokenExpireDate - nowDate) / (1000 * 60 * 60 * 24))
    if (differenceDate <= Config.REFRESH_TOKEN_REFRESH_ALLOWED_DAY) {
      return true
    } else {
      return false
    }
  }

  async refreshRefreshTokenIfPossible() {
    const isAllowed = await this.isAllowedRefresh()
    if (isAllowed) {
      await this.create(this.decoded.payload)
    }
    return isAllowed
  }
}

