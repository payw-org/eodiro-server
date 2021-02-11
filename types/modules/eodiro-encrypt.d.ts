export default class EodiroEncrypt {
    static hash(password: string): Promise<string>;
    static isSame(password: string, hash: string): Promise<boolean>;
}
