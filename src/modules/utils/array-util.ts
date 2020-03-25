export class ArrayUtil {
  static remove<T = any>(arr: T[], value: T): T[] {
    return arr.filter((v) => v !== value)
  }

  /**
   * Replace an element with a new value.
   */
  static replace<T = any>(arr: T[], value: T, newValue: T): void {
    const index = arr.indexOf(value)
    if (index !== -1) {
      arr.splice(index, 1, newValue)
    }
  }

  static has<T = any>(arr: T[], value: T): boolean {
    return arr.indexOf(value) !== -1
  }
}
