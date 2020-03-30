import { OneApiAction } from '..'

/**
 * Where the API requires the authentication
 */
export type AuthRequired<T> = T & {
  accessToken: string
}

/**
 * The basic form of One API action's interface
 */
interface OneApiActionSkeleton {
  data: unknown
  payload: unknown
}

export type OneApiData<T extends OneApiActionSkeleton> = T['data']
export type OneApiPayload<T extends OneApiActionSkeleton> = T['payload']

export type OneApiFunction<T extends OneApiActionSkeleton> = (
  data: OneApiData<T>
) => Promise<OneApiPayload<T>>

export enum OneApiError {
  UNAUTHORIZED = 'Unauthorized',
  BAD_REQUEST = 'Bad Request',
  FORBIDDEN = 'Forbidden',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NO_CONTENT = 'No Content',
}

/**
 * @deprecated Use `OneApiData` instead
 */
export type OneAPIData<T extends OneApiAction> = T['data']
/**
 * @deprecated Use `OneApiPayload` instead
 */
export type OneAPIPayload<T extends OneApiAction> = T['payload']

/**
 * @deprecated Use `OneApiError`
 */
export type OneAPIError<T> =
  | null
  | 'Unauthorized'
  | 'No Content'
  | 'Bad Request'
  | 'Forbidden'
  | 'Internal Server Error'
  | T
