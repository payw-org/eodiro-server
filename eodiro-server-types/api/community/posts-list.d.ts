import { CommunityPostsList } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityPostsListReqQuery = {
    boardId: number;
    page?: number;
};
export declare type ApiCommunityPostsListResData = {
    totalPage: number;
    page: number;
    posts: CommunityPostsList;
};
export default router;
