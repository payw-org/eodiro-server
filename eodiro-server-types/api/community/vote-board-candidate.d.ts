declare const router: import("express-serve-static-core").Router;
export declare type ApiCommunityVoteBoardCandidateReqBody = {
    boardCandidateId: number;
};
export declare type ApiCommunityVoteBoardCandidateResData = {
    votesCount: number;
    alreadyVoted: boolean;
};
export default router;
