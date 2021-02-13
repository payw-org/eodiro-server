import { Request, Response } from 'express';
export declare type Cookie = {
    /** Expiry date in UTC time */
    expires?: string;
    name: string;
    value: string | number;
    /** @default / */
    path?: string;
    /** @default true */
    httpOnly?: boolean;
};
export declare type Cookies = Cookie[];
export declare function setCookie(req: Request, res: Response, cookieData: Cookie | Cookies): void;
export declare function getCookie(req: Request): Record<string, string>;
export declare function getCookie(req: Request, cookieName: string): string;
