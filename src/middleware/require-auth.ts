import { httpStatus } from '@/constant/http-status'
import { extractJwt } from '@/modules/auth/extract-token'
import { JwtError, verifyJwt } from '@/modules/jwt'
import { prisma } from '@/modules/prisma'
import { NextFunction, Request, Response } from 'express'

export type MiddlewareRequireAuthResData = {
  error: JwtError | null
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accessToken = extractJwt(req, res, 'access')
  const [err, authData] = await verifyJwt(accessToken, 'access')
  const resData: MiddlewareRequireAuthResData = { error: err }

  if (err) {
    res.sendStatus(httpStatus.UNAUTHORIZED)
    res.status(httpStatus.UNAUTHORIZED).json(resData)
  } else if (authData) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: authData.userId },
    })

    if (!user) {
      res.sendStatus(httpStatus.UNAUTHORIZED)
      return
    }

    req.user = user
    next()
  }
}
