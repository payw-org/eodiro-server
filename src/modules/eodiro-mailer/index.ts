import Config from '@@/config'
import chalk from 'chalk'
import NodeMailer from 'nodemailer'

const log = console.log

interface MailOption {
  subject: string
  to: string
  html?: string
}

export default class EodiroMailer {
  private static transporter = NodeMailer.createTransport({
    service: Config.MAIL_SERVICE,
    host: Config.MAIL_HOST,
    port: parseInt(Config.MAIL_PORT),
    secure: true,
    auth: {
      user: Config.MAIL_USERNAME,
      pass: Config.MAIL_PASSWORD,
    },
  })

  static async verify(): Promise<boolean> {
    return new Promise((resolve) => {
      this.transporter.verify((err) => {
        if (err) {
          log(`[ ${chalk.red('error')} ] failed to connect to zoho mail server`)
          console.error(err.message)
          resolve(false)
        } else {
          log(`[ ${chalk.yellow('email')} ] connected to zoho mail server`)
          resolve(true)
        }
      })
    })
  }

  // TODO: Asynchronous
  static sendMail(options: MailOption): void {
    this.transporter.sendMail({
      from: '"어디로" <contact@payw.org>',
      subject: options.subject,
      to: options.to,
      html: options.html,
    })
  }
}
