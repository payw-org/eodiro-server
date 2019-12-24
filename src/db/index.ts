import DbConnector from '@/modules/db-connector'
import { MysqlError, FieldInfo } from 'mysql'

export type MysqlResult = any[] | Record<string, any>
export type MysqlQueryReturn = [MysqlError, any[] | MysqlResult, FieldInfo[]]
export type QueryValues = (string | number)[] | string | number

export default class Db {
  static query(query: string): Promise<MysqlQueryReturn>
  static query(query: string, values: QueryValues): Promise<MysqlQueryReturn>
  static query(query: string, values?: QueryValues): Promise<MysqlQueryReturn> {
    return new Promise(async (resolve) => {
      const conn = await DbConnector.getConnection()

      if (!values) {
        values = null
      }

      conn.query(query, values, (err, results, fields) => {
        if (err) {
          console.error(err)
        }
        resolve([err, results, fields])
      })
    })
  }
}
