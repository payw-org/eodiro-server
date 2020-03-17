import { boot } from './boot'
;(async (): Promise<void> => {
  await boot({
    db: true,
    mail: true,
    bot: true,
    listen: true,
  })
})()
