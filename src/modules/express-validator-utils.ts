import { body, header, param, query, ValidationChain } from 'express-validator'

type ChainFunction<T> = (
  fields?: keyof T | (keyof T)[] | undefined,
  message?: any
) => ValidationChain

export function makeBodyValidator<
  BodyType extends Record<string, unknown>
>(): ChainFunction<BodyType> {
  return body
}

export function makeQueryValidator<
  QueryType extends Record<string, unknown>
>(): ChainFunction<QueryType> {
  return query
}

export function makeParamValidator<
  ParamType extends Record<string, unknown>
>(): ChainFunction<ParamType> {
  return param
}

export function makeHeaderValidator<
  HeaderType extends Record<string, unknown>
>(): ChainFunction<HeaderType> {
  return header
}
