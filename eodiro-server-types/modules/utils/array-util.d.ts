export declare class ArrayUtil {
    static remove<T = any>(arr: T[], value: T): T[];
    /**
     * Replace an element with a new value.
     */
    static replace<T = any>(arr: T[], value: T, newValue: T): void;
    static has<T = any>(arr: T[], value: T): boolean;
    static intersect<T = any>(arr1: T[], arr2: T[]): T[];
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
    static diff<T = any>(arr1: T[], arr2: T[]): T[];
}
