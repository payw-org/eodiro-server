import { SafeCommunityBoard } from "../../types/schema";
declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityRecentBoardsReqQuery = {
    excludePins: boolean;
    onlyNames: boolean;
};
export declare type ApiCommunityRecentBoardsResData = SafeCommunityBoard[];
export default router;
