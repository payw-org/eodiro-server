import User from '@/db/user'
import crypto from 'crypto'
import EodiroMailer from '@/modules/eodiro-mailer'
import { SignUpTemplate } from '@/modules/eodiro-mailer/templates'
import AccessToken from './accessToken'
import JwtError from './jwtError'

export interface SignInInfo {
  portalId: string
  password: string
}

export interface SignUpInfo {
  portalId: string
  password: string
  nickname: string
}

export default class Auth {
  static encryptPw(password: string): string {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('base64')
  }

  static generatePendingToken(): string {
    return crypto.randomBytes(20).toString('hex')
  }

  static async verifyPendingUser(token: string): Promise<boolean> {
    if (!token || typeof token !== 'string') {
      console.error('The given token has invalid type')
      return false
    }

    const user = await User.findWithToken(token)

    if (!user) {
      return false
    }

    // Successfully verified
    const pendingUserId = user.id
    const transferResult = await User.transferPendingUser(pendingUserId)

    return transferResult
  }

  /**
   * Validate CAU portal email id
   */
  static isValidPortalIdFormat(portalId: string): boolean {
    const emailRegExp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    const portalIdRegExp = new RegExp(/@cau\.ac\.kr$/)
    if (!emailRegExp.exec(portalId) || !portalIdRegExp.exec(portalId)) {
      // Invalid
      return false
    } else {
      return true
    }
  }

  /**
   * Minimum password length is 8
   */
  static isValidPassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false
    }
    const passwordMinLength = 8
    return password.length >= passwordMinLength
  }

  /**
   * Check duplication of portal id
   *
   * It doesn't check the email format. Use Auth.isValidPortalIdFormat() if you need to check that.
   */
  static async isValidPortalId(portalId: string): Promise<boolean> {
    if (!portalId || typeof portalId !== 'string') {
      return false
    }
    const user = await User.findWithAttrFromAll('portal_id', portalId)
    return user ? false : true
  }

  /**
   * Check nickname format
   */
  static isValidNicknameFormat(nickname: string): boolean {
    if (!nickname || typeof nickname !== 'string') {
      return false
    }

    const minNicknameLength = 2
    const maxNicknameLength = 20
    /**
     * 1. No starts with numbers or _
     * 2. No ends with _
     * 3. No space
     * 4. No multiple _
     * 5. Only accepts Hangul, Alphabets(lowercase), numbers, and _
     */
    const regExp = /^(?![0-9_])(?!.*[_]$)(?!.*?([_])\1{1})[a-z0-9_가-힣]+$/g
    const regExpResult = regExp.exec(nickname)

    return (
      nickname.length >= minNicknameLength &&
      nickname.length <= maxNicknameLength &&
      regExpResult &&
      regExpResult.length > 0
    )
  }

  /**
   * Check duplication of nickname
   */
  static async isValidNickname(nickname: string): Promise<boolean> {
    if (!nickname || typeof nickname !== 'string') {
      return false
    }
    const user = await User.findWithAttrFromAll('nickname', nickname)
    return user ? false : true
  }

  /**
   * Verify the given access token and return user ID if it is valid. Otherwise return false.
   */
  static isSignedUser(accessToken: string): number | false {
    if (!accessToken) {
      return false
    }
    try {
      const at = new AccessToken(accessToken)
      at.verify()
      return at.decoded.payload.userId
    } catch (err) {
      switch (err.code) {
        case JwtError.ERROR.INVALID_JWT:
          // TODO: deal with invalid jwt case
          break
        case JwtError.ERROR.EXPIRED_JWT:
          // TODO : deal with expired jwt case
          break
        default:
          // TODO : deal with unexpected case
          break
      }
      return false
    }
  }

  static async signIn(info: SignInInfo): Promise<[number, boolean]> {
    let { portalId, password } = info

    portalId = portalId ? portalId.trim() : portalId
    password = password ? password.trim() : password

    if (!portalId || !password) {
      return [undefined, false]
    }

    const user = await User.findWithPortalIdAndPw(portalId, password)

    if (user) {
      return [user.id, true]
    }
    return [undefined, false]
  }

  static async signUp(info: SignUpInfo): Promise<boolean> {
    let { portalId, password, nickname } = info

    if (!portalId || !password || !nickname) {
      return false
    }

    // Trim information
    portalId = portalId.trim()
    password = password.trim()
    nickname = nickname.trim()

    // Check the condition

    // Check the validity of portal email
    if (
      !this.isValidPortalIdFormat(portalId) ||
      !this.isValidPortalId(portalId) ||
      !this.isValidNicknameFormat(nickname) ||
      !this.isValidNickname(nickname) ||
      !this.isValidPassword(password)
    ) {
      return false
    }

    // Available
    // There's no user with this portal ID yet
    // Generate hash and send a verification email
    const verificationCode = await User.addPendingUser({
      portalId,
      password,
      nickname
    })

    if (verificationCode) {
      EodiroMailer.sendMail({
        to: portalId,
        subject: '어디로 인증 이메일입니다',
        html: SignUpTemplate(verificationCode)
      })

      return true
    } else {
      return false
    }
  }

  static async signOut(session: Express.Session): Promise<boolean> {
    return new Promise(resolve => {
      session.destroy(err => {
        if (err) {
          console.error(err)
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }
}
