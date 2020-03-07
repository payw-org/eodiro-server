import dayjs = require('dayjs')

/**
 * Create index.ts based on this example
 */

export default {
  PORT: 0,
  DEV_PORT: 0,

  // DB
  DB_HOST: '',
  DB_USER: '',
  DB_PASSWORD: '',
  DB_NAME: '',
  DB_NAME_DEV: '',

  // Email
  MAIL_SERVICE: '',
  MAIL_HOST: '',
  MAIL_PORT: '',
  MAIL_USERNAME: '',
  MAIL_PASSWORD: '',

  // Jwt
  ACCESS_TOKEN_SECRET: '',
  REFRESH_TOKEN_SECRET: '',
  ACCESS_TOKEN_EXPIRE: '',
  REFRESH_TOKEN_EXPIRE: '',
  REFRESH_TOKEN_REFRESH_ALLOWED_VALUE: 3,
  REFRESH_TOKEN_REFRESH_ALLOWED_STANDARD: 'day' as dayjs.UnitType,

  // CAU Portal
  CAU_ID: '',
  CAU_PW: '',

  // Storage
  STORAGE_PATH: '',
  STORAGE_PATH_DEV: '',

  // Cron
  TIME_ZONE: 'Asia/Seoul',
}
