import DbConnector from '@/modules/db-connector'
import { MysqlError, FieldInfo } from 'mysql'

type MysqlQueryReturn = [MysqlError, any[], FieldInfo[]]
type QueryValues = (string | number)[] | string | number

export default class Db {
  static query(query: string): Promise<MysqlQueryReturn>

  static query(query: string, values: QueryValues): Promise<MysqlQueryReturn>

  static query(query: string, values?: QueryValues): Promise<MysqlQueryReturn> {
    return new Promise(async resolve => {
      const conn = await DbConnector.getConnection()

      if (values) {
        conn.query(query, values, (err, results, fields) => {
          resolve([err, results, fields])
        })
      }
      conn.query(query, (err, results, fields) => {
        resolve([err, results, fields])
      })
    })
  }
}
