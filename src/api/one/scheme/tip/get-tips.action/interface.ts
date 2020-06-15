import { OneApiError } from '@/api/one/types'
import { TipListResponse } from '@/database/models/tip'
import { TipTopic } from '@prisma/client'

export interface Action {
  data: {
    topic: TipTopic
    cursor: number
  }
  payload: {
    err: OneApiError
    data: {
      tips: TipListResponse[]
      totalCount: number
    }
  }
}
