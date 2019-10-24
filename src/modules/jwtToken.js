const jwt = require('jsonwebtoken')

class JwtToken {
  /**
   *
   * @param {string} token
   */
  constructor(token) {
    this.token = token
  }

  /**
   *
   * @param {int} code
   */
  static errorWrapper(code) {
    const err = new Error()
    err.code = code
    switch (code) {
      case JwtToken.ERROR.EXPIRED_JWT:
        err.message = 'expired jwt'
        break
      case JwtToken.ERROR.INVALID_JWT:
        err.message = 'inavlid jwt'
        break
    }
    return err
  }

  /**
   *
   * @param {Object} payload
   * @param {string} secret
   * @param {string} expire
   */
  async create(payload, secret, expire) {
    if (!payload) {
      throw new Error('no payload')
    }
    this.token = await jwt.sign(
      payload,
      secret,
      { expiresIn: expire }
    )
  }

  /**
   *
   * @param {string} secret
   */
  async verify(secret) {
    try {
      this.decoded = await jwt.verify(this.token, secret)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw JwtToken.errorWrapper(JwtToken.ERROR.EXPIRED_JWT)
      } else {
        throw JwtToken.errorWrapper(JwtToken.ERROR.INVALID_JWT)
      }
    }
  }
}

JwtToken.ERROR = {
  EXPIRED_JWT: 0,
  INVALID_JWT: 1
}

module.exports = JwtToken
