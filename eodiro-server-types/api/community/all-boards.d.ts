declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityAllBoardsResData = {
    isMine: boolean;
    isPinned: boolean;
    id: number;
    name: string;
    description: string | null;
    priority: number;
    isDeleted: boolean;
    createdAt: Date;
    activeAt: Date | null;
}[];
export declare type ApiCommunityAllBoardCandidatesResData = {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    isMine: boolean;
    votesCount: number;
}[];
export default router;
