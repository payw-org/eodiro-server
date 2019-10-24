const JwtToken = require('./jwtToken')

class AccessToken extends JwtToken {
  /**
   *
   * @param {string} payload
   */
  async create(payload) {
    await super.create(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRE
    )
    await this.verify()
  }

  async verify() {
    await super.verify(process.env.ACCESS_TOKEN_SECRET)
  }
}

module.exports = AccessToken
