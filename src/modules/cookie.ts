import nodeCookie from 'cookie'
import { Request, Response } from 'express'

export type Cookie = {
  /** Expiry date in UTC time */
  expires?: string
  name: string
  value: string | number
  /** @default / */
  path?: string
  /** @default true */
  httpOnly?: boolean
}

export type Cookies = Cookie[]

function buildCookieString(cookie: Cookie, req: Request) {
  let cookieString = `${cookie.name}=${cookie.value};`

  if (cookie.httpOnly !== false) {
    cookieString += 'HttpOnly;'
  }

  if (cookie.expires) {
    cookieString += `Expires=${cookie.expires};`
  }

  if (req && req.secure) {
    cookieString += 'Secure;'
  }

  cookieString += `;Path=${cookie.path ?? '/'};`

  return cookieString
}

export function setCookie(
  req: Request,
  res: Response,
  cookieData: Cookie | Cookies
): void {
  const cookieStrings = [] as string[]

  if (Array.isArray(cookieData)) {
    cookieData.forEach((cookie) => {
      cookieStrings.push(buildCookieString(cookie, req))
    })
  } else {
    cookieStrings.push(buildCookieString(cookieData, req))
  }

  res.setHeader('Set-Cookie', cookieStrings)
}

export function getCookie(req: Request): Record<string, string>
export function getCookie(req: Request, cookieName: string): string
export function getCookie(
  req: Request,
  cookieName?: string
): Record<string, string> | string {
  const cookie = req.headers.cookie ? nodeCookie.parse(req.headers.cookie) : {}

  if (cookieName) {
    return cookie[cookieName]
  }

  return cookie
}
