import { SafeCommunityComment, SafeCommunitySubcomment } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityGetCommentsReqQuery = {
    postId: number;
    /** Comment ID */
    cursor?: number;
};
export declare type ApiCommunityGetCommentsResData = (SafeCommunityComment & {
    communitySubcomments: SafeCommunitySubcomment[];
})[];
export declare type ApiCommunityCreateCommentReqBody = {
    postId: number;
    body: string;
};
export declare type ApiCommunityDeleteCommentReqBody = {
    commentId: number;
};
export default router;
