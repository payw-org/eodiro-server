declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityCreateNewBoardReqBody = {
    name: string;
    description?: string;
};
export declare type ApiCommunityPinBoardReqBody = {
    boardId: number;
};
export declare type ApiCommunityPinBoardResData = {
    isPinned: boolean;
};
export default router;
