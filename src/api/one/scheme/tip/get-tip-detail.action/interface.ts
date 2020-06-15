import { AuthRequired, OneApiError } from '@/api/one/types'

import { TipResponse } from '@/database/models/tip'

export interface Action {
  data: AuthRequired<{
    tipId: number
  }>
  payload: {
    err: OneApiError
    data: TipResponse
  }
}
