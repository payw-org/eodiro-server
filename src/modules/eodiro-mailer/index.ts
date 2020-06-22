import Config from '@/config'
import NodeMailer from 'nodemailer'
import chalk from 'chalk'

const log = console.log

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
}

export default class EodiroMailer {
  private static transporter = NodeMailer.createTransport({
    service: Config.MAIL_SERVICE,
    host: Config.MAIL_HOST,
    port: Config.MAIL_PORT,
    secure: true,
    auth: {
      user: Config.MAIL_USERNAME,
      pass: Config.MAIL_PASSWORD,
    },
  })

  private static isReady = false

  static async verify(): Promise<boolean> {
    return new Promise((resolve) => {
      this.transporter.verify((err) => {
        if (err) {
          log(`[ ${chalk.red('error')} ] failed to connect to zoho mail server`)
          console.error(err.message)
          resolve(false)
        } else {
          log(`[ ${chalk.yellow('email')} ] connected to zoho mail server`)
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
    }

    const defaultFrom = this.createFrom('어디로', 'no-reply')

    const sendOptions = {
      ...options,
      from: options.from
        ? this.createFrom(options.from.name, options.from.alias)
        : defaultFrom,
    }

    return await this.transporter.sendMail(sendOptions)
  }
}
