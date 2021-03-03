import { SafeCommunityBoard } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityPinnedBoardsResData = SafeCommunityBoard[];
export declare function getPinnedBoards({ userId }: {
    userId: number;
}): Promise<{
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
}[]>;
export default router;
