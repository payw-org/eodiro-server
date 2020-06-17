import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

import { TipResponse } from '@/database/models/tip'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
  }>,
  OneApiActionTemplatePayload<OneApiError, TipResponse>
>
