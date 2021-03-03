import { Unpacked } from './unpacked';
declare type Primitive = string | number | boolean | Function | symbol | undefined | null | Date;
export declare type ReplaceKey<T, K, A, D = T & A> = T extends Primitive ? T : T extends any[] ? ReplaceKey<Unpacked<T>, K, A>[] : T extends Record<string, any> ? {
    [P in Exclude<keyof D, K>]: ReplaceKey<D[P], K, A>;
} : T;
export {};
