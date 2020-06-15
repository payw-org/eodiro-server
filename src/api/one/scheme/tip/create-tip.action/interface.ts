import { AuthRequired, OneApiError } from '@/api/one/types'

import { TipTopic } from '@prisma/client'

export interface Action {
  data: AuthRequired<{
    topic: TipTopic
    title: string
    body: string
  }>
  payload: {
    err: OneApiError
    data: number
  }
}
