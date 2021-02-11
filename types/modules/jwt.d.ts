export declare type AuthData = {
    userId: number;
};
export declare const signAccessToken: (authData: AuthData) => string;
export declare const signRefreshToken: (authData: AuthData) => string;
export declare const revokeRefreshToken: (authData: AuthData) => Promise<string>;
export declare enum JwtErrorName {
    TokenExpiredError = "TokenExpiredError",
    JsonWebTokenError = "JsonWebTokenError",
    NotBeforeError = "NotBeforeError",
    RefreshTokenRevokedError = "RefreshTokenRevokedError"
}
export declare type JwtError = {
    name: JwtErrorName;
    message: string;
};
/**
 * Validates refresh token itself and also checks DB.
 */
export declare const verifyJwt: (token: string | null | undefined, type: 'access' | 'refresh') => Promise<[JwtError | null, AuthData | undefined]>;
