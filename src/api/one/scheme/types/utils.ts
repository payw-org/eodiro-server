import { Payload as AuthPayload } from '@/modules/jwt'
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
  payload: {
    err: OneApiError
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
