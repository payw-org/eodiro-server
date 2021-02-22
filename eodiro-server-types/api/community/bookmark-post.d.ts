declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityBookmarkPostReqBody = {
    postId: number;
};
export declare type ApiCommunityBookmarkPostResData = {
    count: number;
    isBookmarkedByMe: boolean;
};
export default router;
