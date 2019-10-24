const JwtToken = require('./jwtToken')

class RefreshToken extends JwtToken {
  /**
   *
   * @param {Object} payload
   */
  async create(payload) {
    await super.create(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRE
    )
    this.verify()
  }

  async verify() {
    await super.verify(process.env.REFRESH_TOKEN_SECRET)
  }

  async isAllowedRefresh() {
    const refreshTokenExpireDate = new Date(this.decoded.exp * 1000)
    const nowDate = new Date()
    const differenceDate = Math.floor((refreshTokenExpireDate - nowDate) / (1000 * 60 * 60 * 24))
    if (differenceDate <= process.env.REFRESH_TOKEN_REFRESH_ALLOWED_DAY) {
      return true
    } else {
      return false
    }
  }
}

module.exports = RefreshToken
