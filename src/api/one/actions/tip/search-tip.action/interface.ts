import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

import { TipListResponse } from '@/database/models/tip'
import { TipTopic } from '@prisma/client'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    topic?: TipTopic
    keyword: string
    page: number
  }>,
  OneApiActionTemplatePayload<{
    tips: TipListResponse[]
    totalCount: number
    totalPage: number
    page: number
  }>
>
