import { LogInInfo } from "../../modules/auth";
export declare type ApiAuthLoginReqBody = LogInInfo;
export declare type ApiAuthLoginResData = {
    isSigned: boolean;
    refreshToken?: string;
    accessToken?: string;
};
declare const router: import("express-serve-static-core").Router;
export default router;
