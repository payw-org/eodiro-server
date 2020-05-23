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
   */
  static getIsoString(): string {
    return dayjs().format('YYYY-MM-DDTHH:mm:ss.000') + 'Z'
  }
}
