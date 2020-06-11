import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'

import { tip_topic } from '@prisma/client'

export interface Action {
  data: AuthRequired<{
    topic: tip_topic
    title: string
    body: string
  }>
  payload: {
    err: OneApiError
    data: number
  }
}
