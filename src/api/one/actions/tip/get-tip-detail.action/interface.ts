import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

import { TipResponse } from '@/database/models/tip'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
  }>,
  OneApiActionTemplatePayload<TipResponse>
>
