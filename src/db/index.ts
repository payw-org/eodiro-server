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
        }
        resolve([err, results, fields])
      })
    })
  }

  static escape(input: string): string | null
  static escape(input: number): number | null
  static escape(input: string | number): string | number | null {
    if (typeof input === 'number') {
      return input
    }

    if (!input) {
      return null
    }

    input = input.toString()

    const escaped = input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(
      char
    ) {
      switch (char) {
        case '\0':
          return '\\0'
        case '\x08':
          return '\\b'
        case '\x09':
          return '\\t'
        case '\x1a':
          return '\\z'
        case '\n':
          return '\\n'
        case '\r':
          return '\\r'
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char // prepends a backslash to backslash, percent,
        // and double/single quotes
        default:
          return char
      }
    })

    return escaped
  }
}
