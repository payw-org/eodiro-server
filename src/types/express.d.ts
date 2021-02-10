import { User } from '@prisma/client'

interface Locals {
  user?: User
}

declare module 'express' {
  export interface Response {
    locals: Locals
  }
}
