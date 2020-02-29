import NodeMailer from 'nodemailer'
import Config from '@@/config'

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
          console.error('❌ Failed to connect to Zoho mail server')
          console.error(err.message)
          resolve(false)
        } else {
          console.info('✉️ Connected to Zoho mail server')
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
