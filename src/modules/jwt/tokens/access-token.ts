import Config from '@@/config'
import { JwtToken, Payload } from './jwt-token'

export class AccessToken extends JwtToken {
  create(payload: Payload): void {
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
