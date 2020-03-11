import 'module-alias/register'
import { boot } from './boot'
;(async (): Promise<void> => {
  await boot({
    db: true,
    mail: true,
    bot: true,
    isDev: process.env.NODE_ENV === 'development',
    listen: true,
  })
})()
