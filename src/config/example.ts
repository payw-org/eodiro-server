/**
 * Create index.ts based on this example
 */

import dayjs from 'dayjs'

export default {
  PORT: 0,
  DEV_PORT: 0,

  // Push Notifications
  PUSH_API_URL: '',
  TEST_EXPO_PUSH_TOKEN: '',

  // DB
  DB_HOST: '',
  DB_USER: '',
  DB_PASSWORD: '',
  DB_NAME: '',
  DB_NAME_DEV: '',

  // Email
  MAIL_SERVICE: '',
  MAIL_HOST: '',
  MAIL_PORT: 0,
  MAIL_USERNAME: '',
  MAIL_PASSWORD: '',

  // Jwt
  ACCESS_TOKEN_SECRET: '',
  REFRESH_TOKEN_SECRET: '',
  ACCESS_TOKEN_EXPIRE: '',
  REFRESH_TOKEN_EXPIRE: '',
  REFRESH_TOKEN_REFRESH_ALLOWED_VALUE: 3,
  REFRESH_TOKEN_REFRESH_ALLOWED_UNIT: 'day' as dayjs.UnitType,

  // CAU Portal
  CAU_ID: '',
  CAU_PW: '',

  // Storage
  STORAGE_PATH: '',
  STORAGE_PATH_DEV: '',

  // Cron
  TIME_ZONE: 'Asia/Seoul',

  // CDN
  CDN_PORT: 0,
  CDN_DEV_PORT: 0,
  PUBLIC_DIR: '',
}
