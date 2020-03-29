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

  static intersect<T = any>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((x) => arr2.includes(x))
  }

  /**
   * `arr1 - arr2`
   *
   * Return an array of different elements between two arrays.
   *
   * For example,
   *
   * `[1, 2] - [1] = [2]`
   *
   * `[1] - [1, 2] = []`
   */
  static diff<T = any>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((x) => !arr2.includes(x))
  }
}
