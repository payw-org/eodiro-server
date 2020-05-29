import Db, { MysqlInsertOrUpdateResult } from '@/db'

import SqlB from '@/modules/sqlb'
;
import { boot } from '@/boot'
(async (): Promise<void> => {
  await boot({
    mail: false,
  })
  const [, results] = await Db.query<MysqlInsertOrUpdateResult>(
    SqlB()
      .update('test', {
        'name': '111',
      })
      .build()
  )
})()
