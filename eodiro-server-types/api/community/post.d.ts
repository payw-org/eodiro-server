import { SafeCommunityPost } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityGetPostReqQuery = {
    postId: number;
};
export declare type ApiCommunityGetPostResData = SafeCommunityPost;
export default router;
