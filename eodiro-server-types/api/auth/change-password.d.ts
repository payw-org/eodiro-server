declare const router: import("express-serve-static-core").Router;
export declare type ApiAuthChangePasswordReqBody = {
    token: string;
    newPassword: string;
};
export default router;
