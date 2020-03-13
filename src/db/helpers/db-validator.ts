import Config from '@/config'
import Db from '@/db'
import { DbTableNames } from '@/db/utils/constants'
import SqlB from '@/modules/sqlb'
import { ArrayUtil } from '@/modules/utils/array-util'
import chalk from 'chalk'
import fs from 'fs'

const log = console.log

const database =
  process.env.NODE_ENV === 'development' ? Config.DB_NAME_DEV : Config.DB_NAME

async function validateTable(tableName: DbTableNames): Promise<boolean> {
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

    return false
  }
}

async function createTable(
  createSQL: string,
  schemaName: string
): Promise<boolean> {
  log(
    `[ ${chalk.blue('↻')} ${chalk.cyan(
      'table'
    )} ] creating a table '${schemaName}'`
  )
  const [err] = await Db.query(createSQL)

  return !err
}

export default async function dbValidator(): Promise<void> {
  log(`[ ${chalk.green('db')} ] validating db '${database}'`)

  const schemaSources = fs
    .readdirSync('./build/db/schema/create')
    .filter((file) => file.endsWith('.js'))

  const processed: string[] = []
  const queue: {
    schemaName: string
    references: string[]
    createSQL: string
  }[] = []

  for (const file of schemaSources) {
    const createSQL: string = require(`../schema/create/${file}`)
    const schemaName = file.replace(/.js$/g, '')

    if (!createSQL) {
      throw new Error(
        `Create SQL of schema ${chalk.yellow(schemaName)} is not provied`
      )
    }

    const refRegExp = /REFERENCES ([a-z_]*)/g
    const matchedAll = createSQL.matchAll(refRegExp)
    let matched
    const references: string[] = []
    while ((matched = matchedAll.next().value)) {
      references.push(matched[1])
    }

    const exist = await validateTable(schemaName as DbTableNames)

    if (!exist) {
      queue.push({
        schemaName,
        createSQL,
        references,
      })
    }
  }

  let i = queue.length - 1
  while (i >= 0) {
    const q = queue[i]

    if (q.references.length === 0) {
      // No foreign keys
      await createTable(q.createSQL, q.schemaName)
      processed.push(q.schemaName)
      queue.pop()
      i -= 1
    } else {
      // Foreign keys
      let allSet = true
      for (const ref of q.references) {
        if (!ArrayUtil.has(processed, ref)) {
          allSet = false
          break
        }
      }

      if (allSet) {
        await createTable(q.createSQL, q.schemaName)
        processed.push(q.schemaName)
        queue.pop()
        i -= 1
      } else {
        const popped = queue.pop()
        queue.unshift(popped)
      }
    }
  }
}
