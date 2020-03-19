import { APIScheme } from '..'

export type RequireAuth<T> = T & {
  accessToken: string
}

export type OneAPIData<T extends APIScheme> = T['data']
export type OneAPIPayload<T extends APIScheme> = T['payload']

export type OneAPIError<T> =
  | null
  | 'Unauthorized'
  | 'No Content'
  | 'Bad Request'
  | 'Forbidden'
  | 'Internal Server Error'
  | T

export enum OneApiError {
  UNAUTHORIZED = 'Unauthorized',
  BAD_REQUEST = 'Bad Request',
  FORBIDDEN = 'Forbidden',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NO_CONTENT = 'No Content',
}
