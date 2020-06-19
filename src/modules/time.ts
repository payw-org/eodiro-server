import dayjs from 'dayjs'

export default class Time {
  /**
   * Returns current server time in format ''YYYY-MM-DD HH:mm:ss''
   */
  static getCurrTime(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * Returns an artificially generated ISO time string
   * for resolving wrong timestamp insertions in MySQL database
   *
   * @deprecated
   */
  static getIsoString(): string {
    return dayjs().format('YYYY-MM-DDTHH:mm:ss.000') + 'Z'
  }

  static getPrismaCurrent(): Date {
    return dayjs().add(9, 'hour').toDate()
  }

  static utcToKst<T>(value: T): T {
    function isPrimitive(test) {
      return test !== Object(test)
    }

    function transformObj(obj: Record<string, unknown>) {
      for (const key of Object.keys(obj)) {
        const val = obj[key]
        if (val instanceof Date) {
          obj[key] = dayjs(val).subtract(9, 'hour').toDate()
        } else if (!isPrimitive(val)) {
          transformObj(val as any)
        }
      }
    }

    if (value instanceof Date) {
      return dayjs(value).subtract(9, 'hour').toDate() as any
    } else if (isPrimitive(value)) {
      return value
    } else {
      transformObj(value as any)
    }

    return value
  }
}

export function prismaTimeMod<T>(value: T): T {
  return Time.utcToKst(value)
}
