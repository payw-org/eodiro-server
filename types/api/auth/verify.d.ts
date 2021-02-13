import { JwtError } from "../../modules/jwt";
declare const router: import("express-serve-static-core").Router;
export declare type ApiAuthGeneralErrResData = {
    error: JwtError | null;
};
export declare type ApiAuthVerifyResData = ApiAuthGeneralErrResData;
export default router;
