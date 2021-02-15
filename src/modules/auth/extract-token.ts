import { eodiroConst } from '@/constant'
import { Request, Response } from 'express'
import { getCookie } from '../cookie'

/**
 * Extract a single token(access/refresh) from cookie first,
 * then Authorization Bearer header.
 */
export const extractJwt = (
  req: Request,
  res: Response,
  type: 'access' | 'refresh'
): string | null => {
  const cookie = getCookie(req)
  const tokenFromCookie =
    cookie[
      type === 'access'
        ? eodiroConst.EDR_ACCESS_TOKEN_NAME
        : eodiroConst.EDR_REFRESH_TOKEN_NAME
    ]

  if (tokenFromCookie) {
    return tokenFromCookie
  }

  const { authorization } = req.headers

  if (!authorization || typeof authorization !== 'string') {
    return null
  }

  const splitAuth = authorization.split(' ')

  const bearerPart = splitAuth[0]
  const tokenFromHeaders = splitAuth[1]

  if (bearerPart !== 'Bearer' || !tokenFromHeaders) {
    return null
  }

  return tokenFromHeaders
}
