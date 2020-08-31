import type {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

import { TipListResponse } from '@/database/models/tip'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    page: number
  }>,
  OneApiActionTemplatePayload<{
    tips: TipListResponse[]
    totalCount: number
    totalPage: number
    page: number
  }>
>
