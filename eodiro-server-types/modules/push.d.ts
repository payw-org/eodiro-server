export declare type PushInformation = {
    /**
     * ExpoPushToken
     */
    to: string | string[];
    title: string;
    subtitle?: string;
    body: string;
    badge?: number;
    data?: {
        type: 'notice';
        url: string;
    } | {
        type: 'comment';
        boardId: number;
        postId: number;
        commentId?: number;
        subcommentId?: number;
    } | Record<string, unknown>;
    sound?: 'default';
    _displayInForeground?: boolean;
};
declare type PushOk = {
    status: 'ok';
    id: string;
};
declare type PushError = {
    status: 'error';
    message: string;
    details: {
        error: string;
    };
};
/**
 * @deprecated Use Telegram Bot instead.
 */
export default class Push {
    static notify(payload: PushInformation | PushInformation[]): Promise<{
        data: (PushOk | PushError)[];
    }>;
}
export {};
