declare const router: import("express-serve-static-core").Router;
export declare const refreshRouterPath = "/auth/refresh";
export declare type ApiAuthRefreshResData = {
    accessToken: string;
};
export default router;
