import {
  Model,
  QueryOptions,
  QueryOptionsWithModel,
  QueryOptionsWithType,
  QueryTypes,
} from 'sequelize'

import { Database } from './index'
import { SqlBInstance } from '@/modules/sqlb'
export { QueryTypes } from 'sequelize'

/**
 * These are migrated and modified version of Sequelize's query declarations from its library
 */

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.UPDATE>
): Promise<[undefined, number]>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.BULKUPDATE>
): Promise<number>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.INSERT>
): Promise<[number, number]>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.UPSERT>
): Promise<number>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.DELETE>
): Promise<void>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.BULKDELETE>
): Promise<number>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.SHOWTABLES>
): Promise<string[]>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.DESCRIBE>
): Promise<{
  [key: string]: {
    type: string
    allowNull: boolean
    defaultValue: string
    primaryKey: boolean
    autoIncrement: boolean
    comment: string | SqlBInstance | null
  }
}>

export function query<M extends Model>(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithModel
): Promise<M[]>

export function query<T extends Record<string, unknown>>(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.SELECT> & { plain: true }
): Promise<T>

export function query<T extends Record<string, unknown>>(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: QueryOptionsWithType<QueryTypes.SELECT>
): Promise<T[]>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
    plain: true
  }
): Promise<{ [key: string]: unknown }>

export function query(
  sql: string | SqlBInstance | { query: string; values: unknown[] },
  options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>
): Promise<[unknown[], unknown]>

export async function query(sql: any, options?: any): Promise<any> {
  if (sql instanceof SqlBInstance) {
    sql = sql.build()
  }
  const sequelize = await Database.getSequelize()
  return sequelize.query(sql, options)
}
