import { Device } from '@prisma/client'
import { OneApiError } from '@/api/one/scheme/types/utils'

export interface Action {
  data: {
    userId: number
  }
  payload: {
    err: OneApiError
    data: Device[]
  }
}
