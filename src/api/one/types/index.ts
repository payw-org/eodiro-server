import { Payload as AuthPayload } from '@/modules/jwt'

export type AuthOnly = {
  accessToken: string
}

export type AuthOptional = {
  accessToken?: string
}

/**
 * Where the API requires the authentication
 */
export type AuthRequired<T> = T & AuthOnly

/**
 * Payload of One API Action Template
 */
export type OneApiActionTemplatePayload<
  E,
  D extends Record<string, unknown>
> = {
  err: OneApiError | E
  data: D | null
}

/**
 * One API Action Template
 */
export type OneApiActionTemplate<
  D = Record<string, unknown>,
  P = OneApiActionTemplatePayload<unknown, Record<string, unknown>>
> = {
  data: D
  payload: P
}

export type OneApiActionTemplateWithoutReqeustData<
  P = OneApiActionTemplatePayload<unknown, Record<string, unknown>>
> = {
  payload: P
}

export type OneApiFuncWithoutRequestData<
  T extends OneApiActionTemplateWithoutReqeustData
> = () => Promise<T['payload']>

export type OneApiFunc<T extends OneApiActionTemplate> = (
  data: T['data'] extends AuthOnly | AuthOptional
    ? Omit<T['data'], 'accessToken'> & { authPayload: AuthPayload }
    : T['data']
) => Promise<T['payload']>

/**
 * The basic form of One API action's interface
 * @deprecated
 */
export interface OneApiActionSkeleton {
  data: unknown
  payload: {
    err: OneApiError | unknown
    data?: any
  }
}

/**
 * Request data type
 */
export type OneApiData<
  T extends OneApiActionSkeleton
> = T['data'] extends AuthRequired<T['data']>
  ? Omit<T['data'], 'accessToken'> & { authPayload: AuthPayload }
  : T['data']

/**
 * Response payload
 */
export type OneApiPayload<T extends OneApiActionSkeleton> = T['payload']
/**
 * Response payload's data (optional)
 */
export type OneApiPayloadData<T extends OneApiActionSkeleton> = OneApiPayload<
  T
>['data']

/**
 * One API function
 */
export type OneApiFunction<T extends OneApiActionSkeleton> = (
  data: OneApiData<T>
) => Promise<OneApiPayload<T>>

/**
 * One API errors enum
 */
export enum OneApiError {
  UNAUTHORIZED = 'Unauthorized',
  BAD_REQUEST = 'Bad Request',
  FORBIDDEN = 'Forbidden',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NO_CONTENT = 'No Content',
}
