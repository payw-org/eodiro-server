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
export declare type ApiCommunityGetSubcommentsReqQuery = {
    commentId: number;
    /** Subcomment ID */
    cursor?: number;
};
export declare type ApiCommunitySubcommentsResData = SafeCommunitySubcomment[];
export declare type ApiCommunityCreateSubcommentReqBody = {
    body: string;
    commentId: number;
};
export declare type ApiCommunityDeleteSubcommentReqBody = {
    subcommentId: number;
};
export default router;
