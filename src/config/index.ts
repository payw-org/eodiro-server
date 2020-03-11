import dayjs from 'dayjs'

export default {
  PORT: 4000,
  DEV_PORT: 4020,

  // DB
  DB_HOST: '13.209.154.203',
  DB_USER: 'root',
  DB_PASSWORD: 'eodiro-mysql-2020',
  DB_NAME: 'eodiro_db',
  DB_NAME_DEV: 'eodiro_db_dev',

  // Email
  MAIL_SERVICE: 'Zoho',
  MAIL_HOST: 'smtp.zoho.com',
  MAIL_PORT: '465',
  MAIL_USERNAME: 'contact@payw.org',
  MAIL_PASSWORD: 'BIenaZcLHh8Z',

  // Jwt
  ACCESS_TOKEN_SECRET: 'm?W9t8RTKxyMmr@b',
  REFRESH_TOKEN_SECRET: 'Pa?g7JQq4P%8aL$V',
  ACCESS_TOKEN_EXPIRE: '1d',
  REFRESH_TOKEN_EXPIRE: '14d',
  REFRESH_TOKEN_REFRESH_ALLOWED_VALUE: 3,
  REFRESH_TOKEN_REFRESH_ALLOWED_UNIT: 'day' as dayjs.UnitType,

  // CAU Portal
  CAU_ID: 'fameu5e',
  CAU_PW: '9cA-8SV-yzJ-Ypn',

  // Storage
  STORAGE_PATH: '../../../storage',
  STORAGE_PATH_DEV: './storage',

  // Cron
  TIME_ZONE: 'Asia/Seoul',
}
