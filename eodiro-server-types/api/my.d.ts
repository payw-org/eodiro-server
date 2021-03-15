import { User } from "../prisma/client";
declare const router: import("express-serve-static-core").Router;
export declare type SafeUser = Omit<User, 'id' | 'password' | 'refreshToken'>;
export default router;
