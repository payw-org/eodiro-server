import { AuthValidationResult } from './validation';
export declare type LogInInfo = {
    portalId: string;
    password: string;
};
export declare type JoinInfo = {
    portalId: string;
    password: string;
    nickname: string;
};
export declare type JoinResult = {
    hasJoined: boolean;
    validations: {
        portalId: AuthValidationResult;
        nickname: AuthValidationResult;
        password: AuthValidationResult;
    };
};
export default class Auth {
    /**
     * Returns an encrypted password
     */
    static encryptPw(password: string): Promise<string>;
    /**
     * @deprecated
     * Legacy password encryption
     */
    static encryptPwLegacy(password: string): string;
    /**
     * Generates a 40-length random token
     * for email verification and password change
     */
    static generateToken(): string;
    static signUp(info: JoinInfo): Promise<JoinResult>;
    static changePassword(portalId: string): Promise<boolean>;
}
