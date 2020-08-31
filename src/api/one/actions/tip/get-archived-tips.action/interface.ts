import type {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

import { TipListResponse } from '@/database/models/tip'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    page: number
  }>,
  OneApiActionTemplatePayload<
    OneApiError,
    {
      tips: TipListResponse[]
      totalCount: number
      totalPage: number
      page: number
    }
  >
>
