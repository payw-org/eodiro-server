export class ArrayUtil {
  static remove(arr: any[], value: any): any[] {
    return arr.filter((v) => v !== value)
  }

  static replace(arr: any[], value: any, newValue: any): any[] {
    const index = arr.indexOf(value)
    return index !== -1 ? arr.splice(index, 1, newValue) : arr
  }
}
