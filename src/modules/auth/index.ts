import EodiroEncrypt from '@/modules/eodiro-encrypt'
import EodiroMailer from '@/modules/eodiro-mailer'
import changePasswordEmailTemplate from '@/modules/eodiro-mailer/templates/change-password'
import joinEmailTemplate from '@/modules/eodiro-mailer/templates/join'
import crypto from 'crypto'
import Mustache from 'mustache'
import { prisma } from '../prisma'
import { rng } from '../random-name-generator'
import { sanitizePortalId } from '../sanitize-portal-id'
import { dbNow } from '../time'
import {
  AuthValidationResult,
  validateNickname,
  validatePassword,
  validatePortalId,
} from './validation'

export type LogInInfo = {
  portalId: string
  password: string
}

export type JoinInfo = {
  portalId: string
  password: string
  nickname: string
}

export type JoinResult = {
  hasJoined: boolean
  validations: {
    portalId: AuthValidationResult
    nickname: AuthValidationResult
    password: AuthValidationResult
  }
}

export default class Auth {
  /**
   * Returns an encrypted password
   */
  static async encryptPw(password: string): Promise<string> {
    return EodiroEncrypt.hash(password)
  }

  /**
   * @deprecated
   * Legacy password encryption
   */
  static encryptPwLegacy(password: string): string {
    return crypto.createHash('sha256').update(password).digest('base64')
  }

  /**
   * Generates a 40-length random token
   * for email verification and password change
   */
  static generateToken(): string {
    return crypto.randomBytes(20).toString('hex')
  }

  static async signUp(info: JoinInfo): Promise<JoinResult> {
    const { portalId, nickname, password } = info

    const portalIdValidation = await validatePortalId(portalId)
    const nicknameValidation = await validateNickname(nickname)
    const passwordValidation = await validatePassword(password)

    const validations = {
      portalId: portalIdValidation,
      nickname: nicknameValidation,
      password: passwordValidation,
    }

    if (
      portalIdValidation.error ||
      nicknameValidation.error ||
      passwordValidation.error
    ) {
      return { hasJoined: false, validations }
    }

    const sanitizedPortalId = sanitizePortalId(portalId)

    // Available
    // There's no user with this portal ID yet
    // Generate hash and send a verification email
    const pendingToken = Auth.generateToken()
    await prisma.pendingUser.create({
      data: {
        portalId: sanitizedPortalId,
        password: await Auth.encryptPw(password),
        nickname,
        token: pendingToken,
        randomNickname: rng(),
        joinedAt: dbNow(),
      },
    })

    // Verification code has been generated

    // Send a verification email

    const html = Mustache.render(joinEmailTemplate, { token: pendingToken })

    EodiroMailer.sendMail({
      to: sanitizedPortalId,
      subject: '[회원가입] 인증 이메일',
      html,
    })

    // Send an additional registration notification email to us
    // EodiroMailer.sendMail({
    //   to: 'contact@payw.org',
    //   subject: `회원가입: ${portalId}`,
    //   html: ''
    // })

    return { hasJoined: true, validations }
  }

  static async changePassword(portalId: string): Promise<boolean> {
    const sanitizedPortalId = sanitizePortalId(portalId)
    const user = await prisma.user.findUnique({
      where: { portalId: sanitizedPortalId },
    })

    if (!user) {
      return false
    }

    const token = Auth.generateToken()
    const now = dbNow()

    await prisma.changePassword.upsert({
      where: {
        userId: user.id,
      },
      create: {
        user: {
          connect: { id: user.id },
        },
        token,
        requestedAt: now,
      },
      update: {
        token,
        requestedAt: now,
      },
    })

    const html = Mustache.render(changePasswordEmailTemplate, { token })

    EodiroMailer.sendMail({
      to: user.portalId,
      subject: '어디로 암호 변경',
      html,
    })

    return true
  }
}
