import Config from '@@/config'
import { JwtToken } from './jwt-token'

export class AccessToken<T> extends JwtToken<T> {
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
      Config.ACCESS_TOKEN_SECRET,
      Config.ACCESS_TOKEN_EXPIRE
    )
    this.verify()
  }

  verify(): void {
    super.verify(Config.ACCESS_TOKEN_SECRET)
  }
}
