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

  select(...what: string[]): SqlBInstance {
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

  from(schema: string): SqlBInstance {
    this.append(`FROM ${schema}`)

    return this
  }

  where(conditions: string): SqlBInstance {
    this.append(`WHERE ${this.singleQuotify(conditions)}`)

    return this
  }

  order(attr: string, direction: 'ASC' | 'DESC'): SqlBInstance {
    this.append(`ORDER BY ${attr} ${direction}`)

    return this
  }

  limit(amount: number | undefined): SqlBInstance {
    this.append(`LIMIT ${this.convert(amount)}`)

    return this
  }

  insert(
    schema: string,
    items: Record<string, number | string | undefined>
  ): SqlBInstance {
    const targetsQuery = Object.keys(items).join(', ')
    const values = Object.values(items).map((val) => {
      return this.convert(val)
    })
    const valuesQuery = values.join(', ')

    this.append(
      `INSERT INTO ${schema} ${this.wrap(
        targetsQuery,
        'parentheses'
      )} VALUES${this.wrap(valuesQuery, 'parentheses')}`
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
}

export default function SqlB(): SqlBInstance {
  return new SqlBInstance()
}
