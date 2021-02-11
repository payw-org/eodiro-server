export declare type AuthValidationResult = {
    isValid: boolean;
    error: null | {
        message: string;
    };
};
/**
 * @param portalId Domain(`@cau.ac.kr`) is optional
 */
export declare function validatePortalId(portalId: string): Promise<AuthValidationResult>;
export declare function validateNickname(nickname: string): Promise<AuthValidationResult>;
export declare function validatePassword(password: string): Promise<AuthValidationResult>;
