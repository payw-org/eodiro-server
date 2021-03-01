import { body, header, param, query, ValidationChain } from 'express-validator'

type ChainFunction<T> = (
  fields?: keyof T | (keyof T)[] | undefined,
  message?: any
) => ValidationChain

export function makeBodyValidator<
  BodyType extends Record<string, unknown>
>(): ChainFunction<BodyType> {
  return body as ChainFunction<BodyType>
}

export function makeQueryValidator<
  QueryType extends Record<string, unknown>
>(): ChainFunction<QueryType> {
  return query as ChainFunction<QueryType>
}

export function makeParamValidator<
  ParamType extends Record<string, unknown>
>(): ChainFunction<ParamType> {
  return param as ChainFunction<ParamType>
}

export function makeHeaderValidator<
  HeaderType extends Record<string, unknown>
>(): ChainFunction<HeaderType> {
  return header as ChainFunction<HeaderType>
}
