import { JwtError } from "../modules/jwt";
import { NextFunction, Request, Response } from 'express';
export declare type MiddlewareRequireAuthResData = {
    error: JwtError | null;
};
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
