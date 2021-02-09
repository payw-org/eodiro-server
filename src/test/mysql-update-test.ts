import { boot } from '@/boot'
import Db, { MysqlInsertOrUpdateResult } from '@/db'
import SqlB from '@/modules/sqlb'

async function run(): Promise<void> {
  await boot()
  const [, results] = await Db.query<MysqlInsertOrUpdateResult>(
    SqlB()
      .update('test', {
        'name': '111',
      })
      .build()
  )
}

run()
