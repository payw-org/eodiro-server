import sqlFormatter from 'sql-formatter'

type Order = 'ASC' | 'asc' | 'DESC' | 'desc'

class SqlBInstance<T = any> {
  private q = ''

  private space(): void {
    this.q = this.q ? this.q.concat(' ') : this.q
  }

  private append(appendingQuery: string): void {
    this.space()
    this.q = this.q.concat(appendingQuery)
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

  private convert(data: number | string | undefined): number | string {
    let convertedData: number | string

    switch (typeof data) {
      case 'string':
        convertedData = this.wrap(data, 'singleQuote')
        break
      case 'number':
        convertedData = data
        break
      case 'undefined':
        convertedData = '?'
        break
      default:
        convertedData = data
        break
    }

    return convertedData
  }

  build(terminate = false): string {
    const built = terminate ? this.q.trim().concat(';') : this.q.trim()
    this.q = ''
    return built
  }

  format(): SqlBInstance<T> {
    this.q = sqlFormatter.format(this.q)

    return this
  }

  raw(str: string): SqlBInstance<T> {
    this.append(str)

    return this
  }

  bind(alias?: string): SqlBInstance<T> {
    this.q = `(${this.q})`

    if (alias) {
      this.append(alias)
    }

    return this
  }

  select(...what: Array<keyof T> | ['*']): SqlBInstance<T> {
    if (what.length === 0) {
      what = ['*']
    }

    const attrs = what.join(', ')

    this.append(`SELECT ${attrs}`)

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

  as(alias: string): SqlBInstance<T> {
    this.q = this.wrap(this.q, 'parentheses')
    this.append(`AS ${alias}`)

    return this
  }

  from(): SqlBInstance<T>
  from(target: string): SqlBInstance<T>
  from(target: SqlBInstance<T>): SqlBInstance<T>
  from(target?: SqlBInstance<T> | string): SqlBInstance<T> {
    if (!target) {
      this.append(`FROM`)
    } else if (typeof target === 'string') {
      this.append(`FROM ${target}`)
    } else {
      this.append(`FROM ${target.build()}`)
    }

    return this
  }

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

  join(schema1: string, schema2: string): SqlBInstance<T> {
    this.append(`${schema1} JOIN ${schema2}`)

    return this
  }

  on(condition?: string): SqlBInstance<T> {
    if (condition) {
      this.append(`ON ${condition}`)
    } else {
      this.append(`ON`)
    }

    return this
  }

  /**
   * @deprecated Use `equal()` instead
   */
  same(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} = ${this.convert(value)}`)

    return this
  }

  equal(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} = ${this.convert(value)}`)

    return this
  }

  andEqual(attr: string, value: number | string): SqlBInstance<T> {
    this.and()
    this.equal(attr, value)

    return this
  }

  notEqual(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} != ${this.convert(value)}`)

    return this
  }
  andNotEqual(attr: string, value: number | string): SqlBInstance<T> {
    this.and()
    this.notEqual(attr, value)

    return this
  }

  equalOrMore(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} >= ${this.convert(value)}`)

    return this
  }

  equalOrLess(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} <= ${this.convert(value)}`)

    return this
  }

  more(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} > ${this.convert(value)}`)

    return this
  }

  less(attr: string, value: number | string): SqlBInstance<T> {
    this.append(`${attr} < ${this.convert(value)}`)

    return this
  }

  group(by: string): SqlBInstance<T> {
    this.append(`GROUP BY ${by}`)

    return this
  }

  order(attr: string, direction: Order = 'asc'): SqlBInstance<T> {
    this.append(`ORDER BY ${attr} ${direction.toUpperCase()}`)

    return this
  }

  multiOrder(options: [string, Order][]): SqlBInstance<T> {
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
    if (!amount) {
      return this
    }

    this.append(`LIMIT ${amount}`)

    if (offset) {
      this.append(`OFFSET ${offset}`)
    }

    return this
  }

  like(column: string, keyword: string): SqlBInstance<T> {
    this.append(`${column} like '${keyword}'`)

    return this
  }

  insert(
    schema: string,
    items: Record<string, number | string | undefined>,
    ignore?: boolean
  ): SqlBInstance<T> {
    const targetsQuery = Object.keys(items).join(', ')
    const values = Object.values(items).map((val) => {
      return this.convert(val)
    })
    const valuesQuery = values.join(', ')

    this.append(
      `INSERT${ignore ? ' IGNORE' : ''} INTO ${schema} ${this.wrap(
        targetsQuery,
        'parentheses'
      )} VALUES${this.wrap(valuesQuery, 'parentheses')}`
    )

    return this
  }

  insertBulk(
    schema: string,
    items: Record<string, number | string | undefined>[],
    ignore?: boolean
  ): SqlBInstance<T> {
    // Analyze first element
    this.append(`INSERT${ignore ? ' IGNORE' : ''} INTO ${schema}`)

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

    return this
  }

  update(
    schema: string,
    items: Record<string, number | string | undefined>
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

  and(sql?: SqlBInstance<T>): SqlBInstance<T> {
    this.append(`AND`)
    if (sql instanceof SqlBInstance) {
      this.append(sql.build())
    }
    return this
  }

  or(sql?: SqlBInstance<T>): SqlBInstance<T> {
    this.append(`OR`)
    if (sql instanceof SqlBInstance) {
      this.append(sql.build())
    }
    return this
  }
}

export default function SqlB<T = any>(): SqlBInstance<T> {
  return new SqlBInstance<T>()
}
