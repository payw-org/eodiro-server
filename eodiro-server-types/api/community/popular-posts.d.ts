import { SafeCommunityPost } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityGetPopularPostsReqQuery = {
    page?: number;
};
export declare type ApiCommunityGetPopularPostsResData = {
    totalPage: number;
    page: number;
    popularPosts: SafeCommunityPost[];
};
export default router;
