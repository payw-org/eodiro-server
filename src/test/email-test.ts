import EodiroMailer from '@/modules/eodiro-mailer'
;(async (): Promise<void> => {
  const verified = await EodiroMailer.verify()
  if (verified) {
    EodiroMailer.sendMail({
      subject: 'Text Email',
      to: 'io@jhaemin.com',
      html: '<h1>Test Email</h1>',
    })
  }
})()
