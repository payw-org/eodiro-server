import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

import { TipTopic } from '@prisma/client'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    title: string
    topic: TipTopic
    body: string
    fileIds: number[]
  }>,
  OneApiActionTemplatePayload<
    OneApiError | 'No Title' | 'No Body',
    { tipId: number }
  >
>
