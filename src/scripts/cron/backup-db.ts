import env from '@/env'
import EodiroMailer from '@/modules/eodiro-mailer'
import { execSync } from 'child_process'
import dayjs from 'dayjs'

try {
  execSync(
    `mysqldump --defaults-extra-file=${env.PATH_MYSQL_CONF} -u ${env.DB_USERNAME} ${env.DB_PROD_NAME} | gzip > ${env.PATH_MYSQL_BACKUP}`
  )

  EodiroMailer.sendMail({
    to: 'io@jhaemin.com',
    subject: `DB backup (${dayjs().format('YYYY-MM-DD HH:mm:ss')})`,
    attachments: [
      {
        filename: 'eodiro_db_backup.sql.gz',
        path: env.PATH_MYSQL_BACKUP,
      },
    ],
  })
} catch (error) {
  EodiroMailer.sendMail({
    to: 'io@jhaemin.com',
    subject: 'Failed to backup DB',
    html:
      error?.message ?? 'Could not read error message. Check the system log.',
  })
}
