import { Unpacked } from './unpacked';
declare type Primitive = string | number | boolean | Function | symbol | undefined | null | Date;
export declare type DeepOmitArray<T extends any[], K> = {
    [P in keyof T]: DeepOmit<T[P], K>;
};
export declare type DeepOmit<T, K> = T extends Primitive ? T : T extends any[] ? DeepOmit<Unpacked<T>, K>[] : T extends Record<string, any> ? {
    [P in Exclude<keyof T, K>]: DeepOmit<T[P], K>;
} : T;
export {};
