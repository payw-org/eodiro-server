import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

import { TipListResponse } from '@/database/models/tip'
import { TipTopic } from '@prisma/client'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    topic: TipTopic
    page: number
  }>,
  OneApiActionTemplatePayload<
    OneApiError,
    {
      tips: TipListResponse[]
      totalCount: number
    }
  >
>
