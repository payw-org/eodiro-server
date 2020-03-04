import Db from '@/db'
import { DbTables } from '@/db/constants'
import SqlB from '@/modules/sqlb'
import Config from '@@/config'
import {
  createAdminTable,
  createCafeteriaMenuTable,
  createCommentTable,
  createCoverageCollegeTable,
  createCoverageMajorLectureTable,
  createCoverageMajorTable,
  createLectureTable,
  createPendingUserTable,
  createPeriodTable,
  createPostTable,
  createRefreshTokenTable,
  createUserTable,
} from '../models'

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
    console.log(`🙅‍♂️ Table '${tableName}' doesn't exist`)
    console.log(`✒️ Creating a table '${tableName}'`)
    await createFunction()
    return false
  }
}

export default async function dbValidator(): Promise<void> {
  console.log(`🩺 Validating DB [${database}]`)

  await validateTable(DbTables.ADMIN, createAdminTable)
  await validateTable(DbTables.USER, createUserTable)
  await validateTable(DbTables.PENDING_USER, createPendingUserTable)
  await validateTable(DbTables.REFRESH_TOKEN, createRefreshTokenTable)
  await validateTable(DbTables.COVERAGE_COLLEGE, createCoverageCollegeTable)
  await validateTable(DbTables.COVERAGE_MAJOR, createCoverageMajorTable)
  await validateTable(DbTables.LECTURE, createLectureTable)
  await validateTable(DbTables.PERIOD, createPeriodTable)
  await validateTable(
    DbTables.COVERAGE_MAJOR_LECTURE,
    createCoverageMajorLectureTable
  )
  await validateTable(DbTables.CAFETERIA_MENU, createCafeteriaMenuTable)
  await validateTable(DbTables.POST, createPostTable)
  await validateTable(DbTables.COMMENT, createCommentTable)
}
