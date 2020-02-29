import Db from '@/db'
import SqlB from '@/modules/sqlb'
import Config from '@@/config'
import {
  createLectureTable,
  createCoverageMajorLectureTable,
  createCafeteriaMenuTable,
} from '@/db/create'

const database =
  process.env.NODE_ENV === 'development' ? Config.DB_NAME_DEV : Config.DB_NAME

async function validateTable(
  tableName: string,
  createFunction: () => Promise<void>
): Promise<boolean> {
  const sql = SqlB()
    .select('*')
    .from('INFORMATION_SCHEMA.TABLES')
    .where(
      SqlB()
        .equal('TABLE_SCHEMA', database)
        .andEqual('TABLE_NAME', tableName)
    )
    .build()

  const [err, results] = await Db.query(sql)

  if (err) {
    return false
  }

  if (results.length > 0) {
    console.log(`✅ Table '${tableName}' exists`)
    return true
  } else {
    console.log(`❌ Table '${tableName}' doesn't exist`)
    console.log(`✒️ Creating a table '${tableName}'`)
    await createFunction()
    return false
  }
}

export default async function dbValidator(): Promise<void> {
  console.log(`Validating DB '${database}'`)

  await validateTable('lecture', createLectureTable)
  await validateTable('coverage_major_lecture', createCoverageMajorLectureTable)
  await validateTable('cafeteria_menu', createCafeteriaMenuTable)
}
