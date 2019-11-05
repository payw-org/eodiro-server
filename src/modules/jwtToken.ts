import Jwt from 'jsonwebtoken'
import JwtError from '@/modules/jwtError'

export interface Payload {
  userId: number
}

export interface Decoded {
  payload: Payload
  exp: number
  iat: number
}

export default class JwtToken {
  public token: string
  public decoded: Decoded

  constructor(token: string = null) {
    this.token = token
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

  async create(payload: Payload, secret: string, expire: string) {
    if (!payload) {
      throw new JwtError('no payload')
    }
    this.token = await Jwt.sign(
      { payload },
      secret,
      { expiresIn: expire }
    )
  }

  async verify(secret: string) {
    try {
      this.decoded = await Jwt.verify(this.token, secret) as Decoded
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw JwtToken.errorWrapper(JwtError.ERROR.EXPIRED_JWT)
      } else {
        console.log(err)
        throw JwtToken.errorWrapper(JwtError.ERROR.INVALID_JWT)
      }
    }
  }
}

