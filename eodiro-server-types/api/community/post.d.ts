import { SafeCommunityPost } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityGetPostReqQuery = {
    postId: number;
};
export declare type ApiCommunityGetPostResData = SafeCommunityPost & {
    likedByMe: boolean;
    bookmarkedByMe: boolean;
    hasBeenEdited: boolean;
    communityBoard: {
        name: string;
    };
};
export declare type ApiCommunityUpsertPostReqBody = {
    postId?: number;
    boardId: number;
    title: string;
    body: string;
};
export declare type ApiCommunityUpsertPostResData = {
    postId: number;
};
export declare type ApiCommunityDeletePostReqBody = {
    postId: number;
};
export default router;
