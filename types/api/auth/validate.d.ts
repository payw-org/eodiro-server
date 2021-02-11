import { AuthValidationResult } from "../../modules/auth/validation";
declare const router: import("express-serve-static-core").Router;
export declare type ApiAuthValidateRequestBody = {
    portalId?: string;
    nickname?: string;
    password?: string;
};
export declare type ApiAuthValidateResponseData = {
    [K in keyof ApiAuthValidateRequestBody]?: AuthValidationResult;
};
export default router;
