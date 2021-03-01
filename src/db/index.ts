import DbConnector from '@/modules/db-connector'
import { SqlBInstance } from '@/modules/sqlb'
import chalk from 'chalk'
import { FieldInfo, MysqlError } from 'mysql'

export type MysqlResult = any[] | Record<string, any>
export type MysqlInsertOrUpdateResult = {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  protocol41: boolean
  changedRows: number
}

export type MysqlQueryReturn<ResultType> = [
  MysqlError | null,
  ResultType | null,
  FieldInfo[] | null | undefined
]
export type QueryValues = (string | number)[] | string | number | null

/**
 * @deprecated Use Prisma
 */
export default class Db {
  static query<ResultType = MysqlResult>(
    query: SqlBInstance
  ): Promise<MysqlQueryReturn<ResultType>>
  static query<ResultType = MysqlResult>(
    query: string
  ): Promise<MysqlQueryReturn<ResultType>>
  static query<ResultType = MysqlResult>(
    query: string,
    values: QueryValues
  ): Promise<MysqlQueryReturn<ResultType>>
  static query<ResultType = MysqlResult>(
    query: string | SqlBInstance,
    values?: QueryValues
  ): Promise<MysqlQueryReturn<ResultType>> {
    return new Promise(async (resolve) => {
      const conn = await DbConnector.getConnection()

      if (!values) {
        values = null
      }

      // Build SqlB
      if (query instanceof SqlBInstance) {
        query = query.build()
      }

      if (query.length === 0) {
        console.log(`[ ${chalk.green('DB query')} ] SQL is empty`)
        resolve([null, null, null])
        return
      }

      conn.query(query, values, (err, results, fields) => {
        if (err) {
          console.log('Query: ', query)
          console.error(err)
          throw err
        }
        resolve([err, results, fields])
      })
    })
  }
}
