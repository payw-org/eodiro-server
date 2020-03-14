export class ArrayUtil {
  static remove<T = any>(arr: T[], value: T): T[] {
    return arr.filter((v) => v !== value)
  }

  static replace<T = any>(arr: T[], value: T, newValue: T): T[] {
    const index = arr.indexOf(value)
    return index !== -1 ? arr.splice(index, 1, newValue) : arr
  }

  static has<T = any>(arr: T[], value: T): boolean {
    return arr.indexOf(value) !== -1
  }
}
