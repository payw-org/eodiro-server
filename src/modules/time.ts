import dayjs from 'dayjs'

export default class Time {
  /**
   * Returns current server time in format ''YYYY-MM-DD HH:mm:ss''
   */
  static getCurrTime(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
}
