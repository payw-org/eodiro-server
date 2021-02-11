/**
 * @deprecated
 */
export default class Time {
    static friendly(time: Date | string): string;
    static yyyymmdd(date: string, pretty?: boolean): string;
    static yyyymmddhhmmss(date: string | Date, pretty?: boolean): string;
    static day(indexOrTime: string): string;
    static day(indexOrTime: number): string;
}
export declare const dbNow: () => Date;
export declare const dbTime: (time: Date) => Date;
export declare function friendlyTime(time: Date | string): string;
export declare function yyyymmddhhmm(date: string | Date, pretty?: boolean): string;
export declare function prismaTimeMod<T>(value: T): T;
export declare const stringifyTime: <T>(value: T) => T;
