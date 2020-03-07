import Jwt from 'jsonwebtoken'
import { JwtError } from './jwt-error'

export interface Decoded<T> {
  payload: T
  exp: number
  iat: number
}
export interface DecodeTokenOption {
  token: string
  secret: string
}

export interface CreateTokenOption<T> {
  payload: T
  secret: string
  expire: string
}

export class JwtToken<T> {
  public token: string
  public decoded: Decoded<T>

  constructor(config: DecodeTokenOption | CreateTokenOption<T>) {
    if ((config as DecodeTokenOption).token !== undefined) {
      this.token = (config as DecodeTokenOption).token
    } else {
      this.create(config as CreateTokenOption<T>)
    }
    this.verify(config.secret)
  }

  static errorWrapper(code: number): JwtError {
    const err = new JwtError()
    err.code = code
    switch (code) {
      case JwtError.ERROR.EXPIRED_JWT:
        err.message = 'expired jwt'
        break
      case JwtError.ERROR.INVALID_JWT:
        err.message = 'inavlid jwt'
        break
    }
    return err
  }

  create(createTokenOption: CreateTokenOption<T>): void {
    const { payload, secret, expire } = createTokenOption

    this.token = Jwt.sign({ payload }, secret, {
      expiresIn: expire,
    })
  }

  verify(secret: string): void {
    try {
      this.decoded = Jwt.verify(this.token, secret) as Decoded<T>
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw JwtToken.errorWrapper(JwtError.ERROR.EXPIRED_JWT)
      } else {
        console.error(err)
        throw JwtToken.errorWrapper(JwtError.ERROR.INVALID_JWT)
      }
    }
  }
}
