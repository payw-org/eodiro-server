import JwtToken, { Payload } from '@/modules/jwtToken'
import Config from '@@/config'

export default class AccessToken extends JwtToken {

  async create(payload: Payload) {
    await super.create(
      payload,
      Config.ACCESS_TOKEN_SECRET,
      Config.ACCESS_TOKEN_EXPIRE
    )
    await this.verify()
  }

  async verify() {
    await super.verify(Config.ACCESS_TOKEN_SECRET)
  }
}

