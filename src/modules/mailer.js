const nodeMailer = require('nodemailer')

class Mailer {
  /**
   * @param {Object} options
   * @param {string} options.to
   * @param {string} options.html
   */
  static sendMail(options) {
    this.transporter.sendMail({
      from: '"어디로" <contact@payw.org>',
      to: options.to,
      html: options.html
    })
  }
}

Mailer.transporter = nodeMailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

module.exports = Mailer
