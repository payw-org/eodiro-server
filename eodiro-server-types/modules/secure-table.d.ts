import { DeepOmit } from "../types/deep-omit";
import { ReplaceKey } from "../types/replace-key";
declare type secureTableReturnType<T> = ReplaceKey<DeepOmit<T, 'isDeleted'>, 'userId', {
    isMine: boolean;
}>;
export declare function secureTable<T = any>(obj: T, userId: number): secureTableReturnType<T>;
export {};
