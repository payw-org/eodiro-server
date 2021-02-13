import { Request, Response } from 'express';
/**
 * Extract a single token(access/refresh) from cookie first,
 * then Authorization Bearer header.
 */
export declare const extractJwt: (req: Request, res: Response, type: 'access' | 'refresh') => string | null;
