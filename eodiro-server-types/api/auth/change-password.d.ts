import { AuthValidationResult } from "../../modules/auth/validation";
declare const router: import("express-serve-static-core").Router;
export declare type ApiAuthChangePasswordReqBody = {
    token: string;
    newPassword: string;
};
export declare type ApiAuthChangePasswordResData = {
    result: AuthValidationResult;
};
export default router;
