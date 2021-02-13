import { httpStatus } from '@/constant/http-status'
import { NextFunction } from 'express-serve-static-core'
import { validationResult } from 'express-validator'

export function handleExpressValidation(
  req: any, // Request
  res: any, // Response,
  next: NextFunction
) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({
      errors: errors.array(),
    })
  }

  next()
}
