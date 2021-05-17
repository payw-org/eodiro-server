import env from '@/env'
import chalk from 'chalk'
import NodeMailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'

const { log } = console

interface MailOption {
  /**
   * "name" \<alias@eodiro.com\>
   */
  from?: {
    name: string
    alias: string
  }
  subject: string
  to: string
  html?: string
  attachments?: Mail.Attachment[]
}

export default class EodiroMailer {
  private static transporter = NodeMailer?.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  })

  private static isReady = false

  static async verify(): Promise<boolean> {
    return new Promise((resolve) => {
      this.transporter.verify((err) => {
        if (err) {
          log(`[ ${chalk.red('error')} ] failed to connect to Gmail server`)
          console.error(err.message)
          resolve(false)
        } else {
          log(`[ ${chalk.yellow('email')} ] connected to Gmail server`)
          this.isReady = true
          resolve(true)
        }
      })
    })
  }

  private static createFrom(name: string, alias: string) {
    return `"${name}" <${alias}@eodiro.com>`
  }

  static async sendMail(options: MailOption): Promise<any> {
    if (!this.isReady) {
      log(`[ ${chalk.yellow('email')} ] not connected to an email server`)
      log(
        `[ ${chalk.yellow(
          'email'
        )} ] connecting to the email server for the first time`
      )
      await this.verify()
    }

    const defaultFrom = this.createFrom('어디로', 'no-reply')

    const sendOptions = {
      ...options,
      from: options.from
        ? this.createFrom(options.from.name, options.from.alias)
        : defaultFrom,
    }

    return this.transporter.sendMail(sendOptions)
  }
}
