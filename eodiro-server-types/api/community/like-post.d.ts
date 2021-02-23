declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityLikePostReqBody = {
    postId: number;
};
export declare type ApiCommunityLikePostResData = {
    count: number;
    alreadyLiked: boolean;
};
export default router;
