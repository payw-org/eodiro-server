import { DeepOmit } from "../types/deep-omit";
import { ReplaceKey } from "../types/replace-key";
export declare function secureTable<T = any>(obj: T, userId: number): ReplaceKey<DeepOmit<T, 'isDeleted'>, 'userId', {
    isMine: boolean;
}>;
