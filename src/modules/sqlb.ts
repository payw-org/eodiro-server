class SqlBInstance {
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

  select(...what: Array<string>): SqlBInstance {
    if (what.length === 0) {
      what = ['*']
    }

    const target = what.join(', ')

    this.append(`SELECT ${target}`)

    return this
  }

  as(alias: string): SqlBInstance {
    this.q = this.wrap(this.q, 'parentheses')
    this.append(`AS ${alias}`)

    return this
  }

  from(target: SqlBInstance): SqlBInstance
  from(target: string): SqlBInstance
  from(target: SqlBInstance | string): SqlBInstance {
    if (typeof target === 'string') {
      this.append(`FROM ${target}`)
    } else {
      this.append(`FROM (${target.build()})`)
    }

    return this
  }

  where(): SqlBInstance
  where(conditions: string): SqlBInstance
  where(conditions: SqlBInstance): SqlBInstance
  where(conditions?: SqlBInstance | string): SqlBInstance {
    if (!conditions) {
      this.append(`WHERE`)
    } else if (typeof conditions === 'string') {
      this.append(`WHERE ${this.singleQuotify(conditions)}`)
    } else {
      this.append(`WHERE ${this.singleQuotify(conditions.build())}`)
    }

    return this
  }

  same(attr: string, value: number | string): SqlBInstance {
    this.append(`${attr} = ${this.convert(value)}`)

    return this
  }

  order(
    attr: string,
    direction: 'ASC' | 'asc' | 'DESC' | 'desc'
  ): SqlBInstance {
    this.append(`ORDER BY ${attr} ${direction.toUpperCase()}`)

    return this
  }

  multiOrder(
    options: [string, 'ASC' | 'asc' | 'DESC' | 'desc'][]
  ): SqlBInstance {
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

  limit(amount: number, offset?: number): SqlBInstance {
    if (!amount) {
      return this
    }

    this.append(`LIMIT ${amount}`)

    if (offset) {
      this.append(`OFFSET ${offset}`)
    }

    return this
  }

  like(column: string, keyword: string): SqlBInstance {
    this.append(`${column} like '${keyword}'`)

    return this
  }

  insert(
    schema: string,
    items: Record<string, number | string | undefined>,
    ignore?: boolean
  ): SqlBInstance {
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
  ): SqlBInstance {
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
  ): SqlBInstance {
    const setQuery = Object.keys(items)
      .map((key) => {
        return `${key} = ${this.convert(items[key])}`
      })
      .join(', ')

    this.append(`UPDATE ${schema} SET ${setQuery}`)

    return this
  }

  delete(): SqlBInstance {
    this.append('DELETE')
    return this
  }

  when(): SqlBInstance {
    this.append('WHEN')
    return this
  }

  notExists(sqlB: SqlBInstance): SqlBInstance {
    this.append(`NOT EXISTS (${sqlB.build()})`)
    return this
  }

  and(): SqlBInstance {
    this.append(`AND`)
    return this
  }

  or(): SqlBInstance {
    this.append(`OR`)
    return this
  }
}

export default function SqlB(): SqlBInstance {
  return new SqlBInstance()
}
