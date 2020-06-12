import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'

import { Tip } from '@prisma/client'

export interface Action {
  data: AuthRequired<{
    tipId: number
  }>
  payload: {
    err: OneApiError
    data: Tip & {
      tipLikes: number
    }
  }
}
