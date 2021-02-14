import { CommunityComment, CommunityPost, CommunityPostBookmark, CommunityPostLike, CommunitySubcomment } from "../prisma/client";
declare type Safe<T> = Omit<T, 'userId' | 'isDeleted'> & {
    isMine: boolean;
};
export declare type SafeCommunityPost = Safe<CommunityPost>;
export declare type SafeCommunityComment = Safe<CommunityComment>;
export declare type SafeCommunitySubcomment = Safe<CommunitySubcomment>;
export declare type CommunityPostsList = (SafeCommunityPost & {
    communityComments: (SafeCommunityComment & {
        communitySubcomments: SafeCommunitySubcomment[];
    })[];
    communityPostLikes: CommunityPostLike[];
    communityPostBookmarks: CommunityPostBookmark[];
})[];
export {};
