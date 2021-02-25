import "./service/telegram";
declare type QuitFunction = () => void;
export declare function boot(): Promise<QuitFunction>;
export {};
