import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

import { TipCommentsResponse } from '@/database/models/tip_comment'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
    lastCommentId: number
  }>,
  OneApiActionTemplatePayload<{
    tipComments: TipCommentsResponse[]
    totalCount: number
  }>
>
