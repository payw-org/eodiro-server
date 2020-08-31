import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

import { TipTopic } from '@prisma/client'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    title: string
    topic: TipTopic
    body: string
    fileIds: number[]
  }>,
  OneApiActionTemplatePayload<{ tipId: number }, 'No Title' | 'No Body'>
>
