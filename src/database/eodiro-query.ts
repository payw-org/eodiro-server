import DbConnector from '@/modules/db-connector'
import { SqlBInstance } from '@/modules/sqlb'
import chalk from 'chalk'

type MysqlInsertUpdateDeleteResult = {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  protocol41: boolean
  changedRows: number
}

export enum EodiroQueryType {
  SELECT = 'select',
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

export async function eodiroQuery<T extends Record<string, any>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown },
  type: EodiroQueryType.INSERT | EodiroQueryType.UPDATE | EodiroQueryType.DELETE
): Promise<MysqlInsertUpdateDeleteResult>
export async function eodiroQuery<T extends Record<string, any>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown },
  type: EodiroQueryType.SELECT
): Promise<T[]>
export async function eodiroQuery<T extends Record<string, any>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown }
): Promise<T[]>
export async function eodiroQuery<T extends Record<string, any>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown }
): Promise<T[] | MysqlInsertUpdateDeleteResult> {
  return new Promise(async (resolve) => {
    const conn = await DbConnector.getConnection()

    const query =
      typeof sql === 'string'
        ? sql
        : sql instanceof SqlBInstance
        ? sql.build()
        : typeof sql?.query === 'string'
        ? sql.query
        : sql?.query instanceof SqlBInstance
        ? sql.query.build()
        : ''

    const values =
      typeof sql !== 'string' && !(sql instanceof SqlBInstance)
        ? sql?.values
        : null

    if (query.length === 0) {
      console.log(`[ ${chalk.green('eodiroQuery')} ] SQL is empty`)
      resolve(null)
      return
    }

    conn.query(query, values, (err, results, fields) => {
      if (err) {
        console.log(`[ ${chalk.red('eodiroQuery - QUERY ERROR')} ]`, query)
        console.error(err.sqlMessage)
        throw err
      }

      resolve(results)
    })
  })
}
