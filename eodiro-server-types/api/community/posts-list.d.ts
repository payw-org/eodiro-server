import { SafeCommunityPost } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityPostsListReqQuery = {
    boardId?: number;
    page?: number;
    my?: 'posts' | 'comments' | 'bookmarks';
};
export declare type ApiCommunityPostsListResData = {
    totalPage: number;
    page: number;
    posts: SafeCommunityPost[];
};
export default router;
