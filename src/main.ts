import { boot } from './boot'
;(async (): Promise<void> => {
  await boot({
    isDev: process.env.NODE_ENV === 'development',
  })
})()
