import DbConnector from '@/modules/db-connector'
import { SqlBInstance } from '@/modules/sqlb'
import chalk from 'chalk'

type MysqlNotSelectResult = {
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
  SELECT_ONE = 'selectOne',
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  NOT_SELECT = 'notSelect',
}

export async function eodiroQuery<T extends Record<string, unknown>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown },
  type:
    | EodiroQueryType.INSERT
    | EodiroQueryType.UPDATE
    | EodiroQueryType.DELETE
    | EodiroQueryType.NOT_SELECT
): Promise<MysqlNotSelectResult>
export async function eodiroQuery<T extends Record<string, unknown>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown },
  type: EodiroQueryType.SELECT
): Promise<T[]>
/**
 * Return a single item. `null` if not exists.
 */
export async function eodiroQuery<T extends Record<string, unknown>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown },
  type: EodiroQueryType.SELECT_ONE
): Promise<T | null>
export async function eodiroQuery<T extends Record<string, unknown>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown }
): Promise<T[]>
export async function eodiroQuery<T extends Record<string, unknown>>(
  sql:
    | string
    | SqlBInstance
    | { query: string | SqlBInstance; values: unknown[] | unknown },
  type?: EodiroQueryType
): Promise<T[] | MysqlNotSelectResult> {
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

      if (type === EodiroQueryType.SELECT_ONE) {
        if (results.length === 0) {
          resolve(null)
          return
        } else {
          resolve(results[0])
          return
        }
      }

      resolve(results)
      return
    })
  })
}
