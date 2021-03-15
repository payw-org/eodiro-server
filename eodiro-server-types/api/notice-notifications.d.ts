declare const router: import("express-serve-static-core").Router;
export declare type ApiNoticeNotificationsGetResData = string[];
export declare type ApiNoticeNotificationsSubscribeReqBody = {
    key: string;
};
export declare type ApiNoticeNotificationsSubscribeResData = {
    subscribed: boolean;
};
export default router;
