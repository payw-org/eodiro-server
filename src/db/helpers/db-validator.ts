import Config from '@/config'
import Db from '@/db'
import { SchemaModule } from '@/db/schema'
import { DbTableNames, DbTables } from '@/db/utils/constants'
import SqlB from '@/modules/sqlb'
import chalk from 'chalk'
import fs from 'fs'
import {
  createAdminTable,
  createCafeteriaMenuTable,
  createChangePasswordTable,
  createCommentTable,
  createCoverageCollegeTable,
  createCoverageMajorLectureTable,
  createCoverageMajorTable,
  createInquiryTable,
  createLectureTable,
  createPendingUserTable,
  createPeriodTable,
  createPostTable,
  createRefreshTokenTable,
  createUserTable,
} from '../models'

const log = console.log

const database =
  process.env.NODE_ENV === 'development' ? Config.DB_NAME_DEV : Config.DB_NAME

async function validateTable(
  tableName: DbTableNames,
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
    log(
      `[ ${chalk.greenBright('✔')} ${chalk.cyan(
        'table'
      )} ] '${tableName}' exists`
    )
    return true
  } else {
    log(
      `[ ${chalk.red('x')} ${chalk.cyan(
        'table'
      )} ] ${tableName}' doesn't exists`
    )
    log(
      `[ ${chalk.blue('↻')} ${chalk.cyan(
        'table'
      )} ] creating a table '${tableName}'`
    )
    await createFunction()
    return false
  }
}

export default async function dbValidator(): Promise<void> {
  log(`[ ${chalk.green('db')} ] validating db '${database}'`)

  await validateTable(DbTables.admin, createAdminTable)
  await validateTable(DbTables.user, createUserTable)
  await validateTable(DbTables.pending_user, createPendingUserTable)
  await validateTable(DbTables.refresh_token, createRefreshTokenTable)
  await validateTable(DbTables.coverage_college, createCoverageCollegeTable)
  await validateTable(DbTables.coverage_major, createCoverageMajorTable)
  await validateTable(DbTables.lecture, createLectureTable)
  await validateTable(DbTables.period, createPeriodTable)
  await validateTable(
    DbTables.coverage_major_lecture,
    createCoverageMajorLectureTable
  )
  await validateTable(DbTables.cafeteria_menu, createCafeteriaMenuTable)
  await validateTable(DbTables.post, createPostTable)
  await validateTable(DbTables.comment, createCommentTable)
  await validateTable(DbTables.inquiry, createInquiryTable)
  await validateTable(DbTables.change_password, createChangePasswordTable)

  const schemaSources = fs
    .readdirSync('./build/db/schema')
    .filter((file) => file.endsWith('.schema.js'))
  console.log(schemaSources)

  schemaSources.forEach((file) => {
    const schemaModule: SchemaModule = require(`../schema/${file}`)
    const schemaName = file.replace(/.schema.js$/g, '')
    const createSQL = schemaModule.sql
    if (!createSQL) {
      throw new Error(
        `Create SQL of schema ${chalk.yellow(schemaName)} is not provied`
      )
    }
    console.log(schemaName, createSQL)
  })
}
