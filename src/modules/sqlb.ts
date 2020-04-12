/**
 * SqlB - Simple query builder
 * Copyright 2020 jhaemin
 */

import { TableNames } from '@/database/table-names'
import mysql from 'mysql'
import sqlFormatter from 'sql-formatter'

type Order = 'ASC' | 'asc' | 'DESC' | 'desc'
type SqlBValue = number | string | undefined
type SqlBNullableValue = SqlBValue | null
type KeyValue<T> = {
  [K in keyof T]?: T[K]
}

export class SqlBInstance<T = any> {
  private q = ''

  /**
   * Add a space at the end
   */
  private space(): void {
    this.q = this.q ? this.q.concat(' ') : this.q
  }

  /**
   * Append query with a space before
   */
  private append(appendingQuery: string): void {
    this.space()
    this.concat(appendingQuery)
  }
  /**
   * Concatenate string without a space
   */
  private concat(str: string): void {
    this.q = this.q.concat(str)
  }

  private wrap(text: string, wrapper: 'singleQuote' | 'parentheses'): string {
    let left: string, right: string
    switch (wrapper) {
      case 'singleQuote':
        left = "'"
        right = "'"
        break
      case 'parentheses':
        left = '('
        right = ')'
        break
    }

    return left + text + right
  }

  private singleQuotify(text: string): string {
    return text.replace(/"/g, "'")
  }

  /**
   * Convert `undefined` to '?' and escape others
   */
  private convert(data: number | string | undefined): number | string {
    let convertedData: number | string
    const escaped = mysql.createConnection({}).escape(data)

    if (typeof data === 'undefined') {
      convertedData = '?'
    } else if (data === null) {
      convertedData = 'NULL'
    } else {
      convertedData = escaped
    }

    return convertedData
  }

  build(terminate = false): string {
    const built = terminate ? this.q.trim().concat(';') : this.q.trim()
    return built
  }

  /**
   * Format the output. Use this before `build()`.
   */
  format(): SqlBInstance<T> {
    this.q = sqlFormatter.format(this.q)

    return this
  }

  raw(str: string): SqlBInstance<T> {
    this.append(str)

    return this
  }

  /**
   * `(...) alias`
   *
   * Wrap the whole query currently built with braces.
   */
  bind(alias?: string): SqlBInstance<T> {
    this.q = `(${this.q})`

    if (alias) {
      this.append(alias)
    }

    return this
  }

  /**
   * `SELECT`
   *
   * Select columns from table. If you specify a generic schema type,
   * it only allows the keys of the given type.
   * Use `alsoSelectAny` for more flexible selection.
   * @param what Array of strings or SqlB instances. Empty will select all.
   */
  select(...what: Array<keyof T | '*' | SqlBInstance>): SqlBInstance<T> {
    if (what.length === 0) {
      what = ['*']
    }

    const attrs = what
      .map((col) => {
        if (col instanceof SqlBInstance) {
          return col.build()
        } else {
          return col
        }
      })
      .join(', ')

    this.append(`SELECT ${attrs}`)

    return this
  }
  /**
   * Don't use this method alone.
   * Run `select()` or `selectAny()` first.
   */
  alsoSelect(...what: Array<keyof T | '*' | SqlBInstance>): SqlBInstance<T> {
    this.concat(', ')
    const attrs = what
      .map((col) => {
        if (col instanceof SqlBInstance) {
          return col.build()
        } else {
          return col
        }
      })
      .join(', ')
    this.append(attrs)
    return this
  }
  selectAny(...what: string[]): SqlBInstance<T> {
    this.append(`SELECT ${what.join(', ')}`)
    return this
  }
  /**
   * Don't know why this method is created.
   * Can't find any use cases.
   *
   * Don't use this method alone.
   * Run `select()` or `selectAny()` first.
   */
  alsoSelectAny(...what: string[]): SqlBInstance<T> {
    this.concat(', ')
    this.append(what.join(', '))
    return this
  }

  distinctSelect(
    ...what: (keyof T | '*' | SqlBInstance<T>)[]
  ): SqlBInstance<T> {
    if (what.length === 0) {
      what = ['*']
    }

    const attrs = what
      .map((w) => {
        if (w instanceof SqlBInstance) {
          return w.build()
        } else {
          return w
        }
      })
      .join(', ')

    this.append(`SELECT DISTINCT ${attrs}`)

    return this
  }

  /**
   * Wrap whole query in SqlBInstance and append alias.
   *
   * `(query_until_now) AS alias`
   */
  as(alias: string): SqlBInstance<T> {
    this.q = this.wrap(this.q, 'parentheses')
    this.append(`AS ${alias}`)

    return this
  }

  /**
   * `FROM target`
   *
   * Pass nothing only appends `FROM` statement
   */
  from(): SqlBInstance<T>
  from(target: string): SqlBInstance<T>
  from(target: TableNames): SqlBInstance<T>
  from(target: SqlBInstance<T>): SqlBInstance<T>
  from(target?: SqlBInstance<T> | string | TableNames): SqlBInstance<T> {
    if (!target) {
      this.append(`FROM`)
    } else if (typeof target === 'string') {
      this.append(`FROM ${target}`)
    } else {
      this.append(`FROM ${target.build()}`)
    }

    return this
  }

  /**
   * `WHERE conditions`
   *
   * Pass nothing only appends `WHERE` statement
   */
  where(): SqlBInstance<T>
  where(conditions: string): SqlBInstance<T>
  where(conditions: SqlBInstance<T>): SqlBInstance<T>
  where(conditions?: SqlBInstance<T> | string): SqlBInstance<T> {
    if (!conditions) {
      this.append(`WHERE`)
    } else if (typeof conditions === 'string') {
      this.append(`WHERE ${this.singleQuotify(conditions)}`)
    } else {
      this.append(`WHERE ${this.singleQuotify(conditions.build())}`)
    }

    return this
  }

  /**
   * `schema1 JOIN schema2`
   */
  join(
    schema1: TableNames | string,
    schema2: TableNames | string,
    outer?: 'left' | 'right'
  ): SqlBInstance<T> {
    this.append(
      `${schema1}${outer ? ` ${outer.toUpperCase()}` : ''} JOIN ${schema2}`
    )

    return this
  }

  /**
   * `ON condition`
   */
  on(condition?: string): SqlBInstance<T> {
    if (condition) {
      this.append(`ON ${condition}`)
    } else {
      this.append(`ON`)
    }

    return this
  }

  in(attr: keyof T, values: SqlBValue[]): SqlBInstance<T> {
    if (!values || values.length === 0) {
      throw new Error(
        'You are using `IN` statement without passing any sequence of values. It may lead to unexpected situations like deleting whole rows.'
      )
    }
    this.append(`${attr} IN (${values.join(', ')})`)
    return this
  }

  isNull(attr: keyof T): SqlBInstance<T> {
    this.append(`${attr} IS NULL`)
    return this
  }
  andIsNull(attr: keyof T): SqlBInstance<T> {
    this.and()
    this.append(`${attr} IS NULL`)
    return this
  }
  orIsNull(attr: keyof T): SqlBInstance<T> {
    this.or()
    this.append(`${attr} IS NULL`)
    return this
  }
  isNotNull(attr: keyof T): SqlBInstance<T> {
    this.append(`${attr} IS NOT NULL`)
    return this
  }
  andIsNotNull(attr: keyof T): SqlBInstance<T> {
    this.and()
    this.append(`${attr} IS NOT NULL`)
    return this
  }
  orIsNotNull(attr: keyof T): SqlBInstance<T> {
    this.or()
    this.append(`${attr} IS NOT NULL`)
    return this
  }

  /**
   * > NOTE: To check `NULL`, use `isNull()`
   */
  equal(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.append(`${attr} = ${this.convert(value)}`)
    return this
  }

  andEqual(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.and()
    this.equal(attr, value)
    return this
  }

  /**
   * > NOTE: To check `NULL`, use `isNotNull()`
   */
  notEqual(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.append(`${attr} != ${this.convert(value)}`)
    return this
  }

  andNotEqual(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.and()
    this.notEqual(attr, value)
    return this
  }

  /** attr >= value */
  equalOrMore(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.append(`${attr} >= ${this.convert(value)}`)
    return this
  }
  /** AND attr >= value */
  andEqualOrMore(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.and()
    this.equalOrMore(attr, value)
    return this
  }

  /** attr <= value */
  equalOrLess(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.append(`${attr} <= ${this.convert(value)}`)
    return this
  }
  /** AND attr <= value */
  andEqualOrLess(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.and()
    this.equalOrLess(attr, value)
    return this
  }

  /** attr > value */
  more(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.append(`${attr} > ${this.convert(value)}`)
    return this
  }
  /** AND attr > value */
  andMore(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.and()
    this.more(attr, value)
    return this
  }

  /** attr < value */
  less(attr: string, value: SqlBValue): SqlBInstance<T> {
    this.append(`${attr} < ${this.convert(value)}`)
    return this
  }
  /** AND attr < value */
  andLess(attr: string, value: SqlBValue): SqlBInstance {
    this.and()
    this.less(attr, value)
    return this
  }

  group(by: keyof T): SqlBInstance<T> {
    this.append(`GROUP BY ${by}`)
    return this
  }

  order(attr: keyof T, direction: Order = 'asc'): SqlBInstance<T> {
    this.append(`ORDER BY ${attr} ${direction.toUpperCase()}`)
    return this
  }

  multiOrder(options: [keyof T, Order][]): SqlBInstance<T> {
    this.append(`ORDER BY`)
    this.append(
      options
        .map((option) => {
          return `${option[0]} ${option[1].toUpperCase()}`
        })
        .join(', ')
    )

    return this
  }

  limit(amount: number, offset?: number): SqlBInstance<T> {
    if (!amount) return this
    this.append(`LIMIT ${this.convert(amount)}`)
    if (offset) this.append(`OFFSET ${this.convert(offset)}`)
    return this
  }

  like(column: keyof T, keyword: string): SqlBInstance<T> {
    this.append(`${column} LIKE ${this.convert(keyword)}`)
    return this
  }

  private onDuplicateKeyUpdate(attributes: (keyof T)[]) {
    if (attributes.length === 0) {
      return
    }

    this.append('ON DUPLICATE KEY UPDATE')
    this.append(
      attributes
        .map((attr) => {
          return `${attr} = VALUES(${attr})`
        })
        .join(', ')
    )
  }

  insert(
    schema: string,
    items: {
      [K in keyof T]?: T[K]
    },
    dupStrategy?:
      | 'ignore'
      | 'update'
      | {
          strategy: 'update'
          attributes: (keyof T)[]
        }
  ): SqlBInstance<T> {
    const targetsQuery = Object.keys(items).join(', ')
    const values = Object.values(items).map((val) => {
      return this.convert(val as any)
    })
    const valuesQuery = values.join(', ')

    this.append(
      `INSERT${
        typeof dupStrategy === 'string' && dupStrategy === 'ignore'
          ? ' IGNORE'
          : ''
      } INTO ${schema} ${this.wrap(
        targetsQuery,
        'parentheses'
      )} VALUES${this.wrap(valuesQuery, 'parentheses')}`
    )

    if (
      (typeof dupStrategy === 'string' && dupStrategy === 'update') ||
      (typeof dupStrategy === 'object' && dupStrategy?.strategy === 'update')
    ) {
      this.onDuplicateKeyUpdate(
        typeof dupStrategy === 'object'
          ? dupStrategy.attributes
          : (Object.keys(items) as (keyof T)[])
      )
    }

    return this
  }

  bulkInsert(
    schema: TableNames,
    items: {
      [K in keyof T]?: T[K]
    }[],
    dupStrategy?:
      | 'ignore'
      | 'update'
      | {
          strategy: 'update'
          attributes: (keyof T)[]
        }
  ): SqlBInstance<T> {
    if (items.length === 0) {
      return this
    }

    this.append(
      `INSERT${
        typeof dupStrategy === 'string' && dupStrategy === 'ignore'
          ? ' IGNORE'
          : ''
      } INTO ${schema}`
    )

    // Analyze first element
    const firstItem = items[0]
    const keys = Object.keys(firstItem)

    this.append(`(${keys.join(', ')}) VALUES`)

    this.append(
      items
        .map((item) => {
          return `(${keys
            .map((key) => {
              return this.convert(item[key])
            })
            .join(', ')})`
        })
        .join(', ')
    )

    if (
      (typeof dupStrategy === 'string' && dupStrategy === 'update') ||
      (typeof dupStrategy === 'object' && dupStrategy?.strategy === 'update')
    ) {
      this.onDuplicateKeyUpdate(
        typeof dupStrategy === 'object'
          ? dupStrategy.attributes
          : (Object.keys(items[0]) as (keyof T)[])
      )
    }

    return this
  }

  /**
   * `UPDATE schema SET attribute = 'value', ...`
   */
  update(
    schema: string,
    items: {
      [K in keyof T]?: T[K]
    }
  ): SqlBInstance<T> {
    const setQuery = Object.keys(items)
      .map((key) => {
        return `${key} = ${this.convert(items[key])}`
      })
      .join(', ')

    this.append(`UPDATE ${schema} SET ${setQuery}`)

    return this
  }

  delete(): SqlBInstance<T> {
    this.append('DELETE')
    return this
  }

  when(): SqlBInstance<T> {
    this.append('WHEN')
    return this
  }

  notExists(sqlB: SqlBInstance<T>): SqlBInstance<T> {
    this.append(`NOT EXISTS (${sqlB.build()})`)
    return this
  }

  and(sql?: string | SqlBInstance<T>): SqlBInstance<T> {
    this.append(`AND`)
    if (sql) {
      if (sql instanceof SqlBInstance) {
        sql = sql.build()
      }
      this.append(sql)
    }
    return this
  }

  or(sql?: string | SqlBInstance<T>): SqlBInstance<T> {
    this.append(`OR`)
    if (sql) {
      if (sql instanceof SqlBInstance) {
        sql = sql.build()
      }
      this.append(sql)
    }
    return this
  }
}

export default function SqlB<T = any>(): SqlBInstance<T> {
  return new SqlBInstance<T>()
}

/**
 * SqlB function alias
 */
export const Q = SqlB

// Utility function that escapes any value
// using node mysql's escape method
SqlB.escape = (value: any) => {
  return mysql.createConnection({}).escape(value)
}
