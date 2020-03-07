import Config from '@@/config'
import { JwtToken } from './jwt-token'

export class AccessToken<T> extends JwtToken<T> {
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
