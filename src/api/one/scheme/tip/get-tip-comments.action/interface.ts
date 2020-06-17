import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

import { TipCommentsResponse } from '@/database/models/tip_comment'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
    lastCommentId: number
  }>,
  OneApiActionTemplatePayload<
    OneApiError,
    {
      tipComments: TipCommentsResponse[]
      totalCount: number
    }
  >
>
