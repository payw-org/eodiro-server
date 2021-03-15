import { CommunityBoard, CommunityComment, CommunityPost, CommunitySubcomment } from "../prisma/client";
declare type SafeContent<T> = Omit<T, 'userId' | 'isDeleted'> & {
    isMine: boolean;
};
export declare type SafeCommunityBoard = Omit<CommunityBoard, 'isDeleted' | 'priority' | 'activeAt' | 'createdBy' | 'description' | 'createdAt'> & {
    description?: string | null;
    createdAt?: Date;
};
export declare type SafeCommunityPost = SafeContent<CommunityPost>;
export declare type SafeCommunityComment = SafeContent<CommunityComment>;
export declare type SafeCommunitySubcomment = SafeContent<CommunitySubcomment>;
export {};
