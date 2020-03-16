import Db from '@/db'
import User, { UserId } from '@/db/modules/user'
import EodiroEncrypt from '@/modules/eodiro-encrypt'
import EodiroMailer from '@/modules/eodiro-mailer'
import Jwt, { Payload } from '@/modules/jwt'
import crypto from 'crypto'
import Mustache from 'mustache'
import joinEmailTemplate from './eodiro-mailer/templates/join'

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
  /**
   * Returns an encrypted password
   */
  static async encryptPw(password: string): Promise<string> {
    return await EodiroEncrypt.hash(password)
  }

  /**
   * @deprecated
   * Legacy password encryption
   */
  static encryptPwLegacy(password: string): string {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('base64')
  }

  /**
   * Generates a random token which will be
   * stored in DB and will be used later
   * for email verification
   */
  static generateToken(): string {
    return crypto.randomBytes(20).toString('hex')
  }

  /**
   * Verifies the email verification with the given token
   */
  static async verifyPendingUser(token: string): Promise<boolean> {
    if (!token || typeof token !== 'string') {
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
   * Validates a password
   */
  static isValidPassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false
    }
    const passwordMinLength = 8
    return password.length >= passwordMinLength
  }

  /**
   * Checks duplication of portal id
   *
   * **_NOTE:_** It doesn't check the email format.
   * Use Auth.isValidPortalIdFormat() if you need to check that.
   */
  static async isValidPortalId(portalId: string): Promise<boolean> {
    if (!portalId || typeof portalId !== 'string') {
      return false
    }
    const user = await User.findWithAttrFromAll('portal_id', portalId)
    return user ? false : true
  }

  /**
   * Checks nickname format
   */
  static isValidNicknameFormat(nickname: string): boolean {
    if (!nickname || typeof nickname !== 'string') {
      return false
    }

    const minNicknameLength = 2
    const maxNicknameLength = 20
    /**
     * Conditions
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
   * Checks duplication of nickname
   */
  static async isValidNickname(nickname: string): Promise<boolean> {
    if (!nickname || typeof nickname !== 'string') {
      return false
    }
    const user = await User.findWithAttrFromAll('nickname', nickname)
    return user ? false : true
  }

  /**
   * Verifies the given access token and returns user ID if it is valid.
   * Otherwise returns false.
   */
  static async isSignedUser(accessToken: string): Promise<Payload | false> {
    if (!accessToken) {
      return false
    }
    const result = await Jwt.verify(accessToken)
    return result
  }

  static async signIn(info: SignInInfo): Promise<[UserId, boolean]> {
    let portalId = Db.escape(info?.portalId)
    let password = Db.escape(info?.password)

    // Refine information
    portalId = portalId ? portalId.trim().toLowerCase() : portalId
    password = password ? password.trim() : password

    if (!portalId || !password) {
      return [undefined, false]
    }

    const user = await User.findWithPortalId(portalId, true)

    // TODO: Remove the legacy password matching process
    if (
      user &&
      ((await EodiroEncrypt.isSame(password, user.password)) ||
        user.password === Auth.encryptPwLegacy(password))
    ) {
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
    portalId = portalId.trim().toLowerCase()
    password = password
    nickname = nickname.trim()

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
    const token = await User.addPendingUser({
      portalId,
      password,
      nickname,
    })

    // Verification code has been generated
    if (token) {
      // Send a verification email

      const html = Mustache.render(joinEmailTemplate, { token })

      EodiroMailer.sendMail({
        to: portalId,
        subject: '[회원가입] 인증 이메일',
        html,
      })

      // Send an additional registration notification email to us
      // EodiroMailer.sendMail({
      //   to: 'contact@payw.org',
      //   subject: `회원가입: ${portalId}`,
      //   html: ''
      // })

      return true
    } else {
      return false
    }
  }

  /**
   * Clears session
   * @deprecated It does nothing on server side in favor of JWT
   */
  static async signOut(session: Express.Session): Promise<boolean> {
    return new Promise((resolve) => {
      session.destroy((err) => {
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
