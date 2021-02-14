import { ValidationChain } from 'express-validator';
declare type ChainFunction<T> = (fields?: keyof T | (keyof T)[] | undefined, message?: any) => ValidationChain;
export declare function makeBodyValidator<BodyType extends Record<string, unknown>>(): ChainFunction<BodyType>;
export declare function makeQueryValidator<QueryType extends Record<string, unknown>>(): ChainFunction<QueryType>;
export declare function makeParamValidator<ParamType extends Record<string, unknown>>(): ChainFunction<ParamType>;
export declare function makeHeaderValidator<HeaderType extends Record<string, unknown>>(): ChainFunction<HeaderType>;
export {};
