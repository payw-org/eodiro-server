export class JwtError extends Error {
  public code: number

  static ERROR = {
    EXPIRED_JWT: 0,
    INVALID_JWT: 1,
  }
}
