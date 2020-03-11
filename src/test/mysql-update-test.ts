import { boot } from '@/boot'
import Db, { MysqlInsertOrUpdateResult } from '@/db'
import SqlB from '@/modules/sqlb'
;(async (): Promise<void> => {
  await boot({
    mail: false,
    bot: false,
    isDev: true,
  })
  const [, results] = await Db.query<MysqlInsertOrUpdateResult>(
    SqlB()
      .update('test', {
        'name': '111',
      })
      .build()
  )
})()
