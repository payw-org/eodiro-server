export type HTTPStatus = 200 | 201 | 204 | 400 | 401 | 403 | 500

export const HttpStatusCode = {
  OK: 200 as HTTPStatus,
  CREATED: 201 as HTTPStatus,
  NO_CONTENT: 204 as HTTPStatus,
  BAD_REQUEST: 400 as HTTPStatus,
  UNAUTHORIZED: 401 as HTTPStatus,
  FORBIDDEN: 403 as HTTPStatus,
  INTERNAL_SERVER_ERROR: 500 as HTTPStatus,
}
