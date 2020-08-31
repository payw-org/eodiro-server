import { AuthOnly, OneApiError } from '@/api/one/types'

import { Device } from '@prisma/client'

export interface Action {
  data: AuthOnly
  payload: {
    err: OneApiError
    data: Device[]
  }
}
