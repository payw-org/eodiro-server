import { AuthOnly, OneApiError } from '@/api/one/scheme/types/utils'

import { Device } from '@prisma/client'

export interface Action {
  data: AuthOnly
  payload: {
    err: OneApiError
    data: Device[]
  }
}
