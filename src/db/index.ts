import DbConnector from '@/modules/db-connector'
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

export type MysqlQueryReturn<ResultType> = [MysqlError, ResultType, FieldInfo[]]
export type QueryValues = (string | number)[] | string | number

export default class Db {
  static query<ResultType = MysqlResult>(
    query: string
  ): Promise<MysqlQueryReturn<ResultType>>
  static query<ResultType = MysqlResult>(
    query: string,
    values: QueryValues
  ): Promise<MysqlQueryReturn<ResultType>>
  static query<ResultType = MysqlResult>(
    query: string,
    values?: QueryValues
  ): Promise<MysqlQueryReturn<ResultType>> {
    return new Promise(async (resolve) => {
      const conn = await DbConnector.getConnection()

      if (!values) {
        values = null
      }

      conn.query(query, values, (err, results, fields) => {
        if (err) {
          console.error(err.sqlMessage)
          throw err
        }
        resolve([err, results, fields])
      })
    })
  }
}
